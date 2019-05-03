import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { EmailValidator } from '../../utils/form/validators/email/email';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { MinLengthValidator } from '../../utils/form/validators/min-length/min-length';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { ModulVue } from '../../utils/vue/vue';
import { FORM_NAME } from '../component-names';
import { MForm } from './form';
import FormPlugin from './form.plugin';
import WithRender from './form.sandbox.html';


@WithRender
@Component
export class MFormSandbox extends ModulVue {
    isDuplicateCourseCode: boolean = false;
    formGroups: FormGroup[] = [
        new FormGroup(
            'Required and max characters',
            [
                new FormControl<string>(
                    'Title',
                    [
                        RequiredValidator('Title'),
                        MaxLengthValidator('Title', 5)
                    ]
                )
            ]
        ),
        new FormGroup(
            'Required and min characters',
            [
                new FormControl<string>(
                    'Security answer',
                    [
                        RequiredValidator('Security answer'),
                        MinLengthValidator('Security answer', 5)
                    ]
                )
            ]
        ),
        new FormGroup(
            'Format with fixed max characters (postal code)',
            [
                new FormControl<string>(
                    'Postal code',
                    [
                        RequiredValidator('Postal code'),
                        {
                            key: 'postal-code-format',
                            validationFunction: (control: FormControl<string>): Promise<boolean> => {
                                const regex: RegExp = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

                                return Promise.resolve(regex.test(control.value || ''));
                            },
                            error: {
                                message: 'Enter postal code.'
                            },
                            validationType: ControlValidatorValidationType.OnGoing
                        }
                    ]
                )
            ]
        ),
        new FormGroup(
            'Format without fixed max characters (email)',
            [
                new FormControl<string>(
                    'Email',
                    [
                        RequiredValidator('Email'),
                        EmailValidator('Email')
                    ]
                )
            ]
        ),
        new FormGroup(
            'More than one validations',
            [
                new FormControl<string>(
                    'Course code',
                    [
                        RequiredValidator('Course code'),
                        MaxLengthValidator('Course code', 8, {
                            validationType: ControlValidatorValidationType.OnGoing
                        }),
                        {
                            key: 'course-code-format',
                            validationFunction: (control: FormControl<string>): Promise<boolean> => {
                                const regex: RegExp = /^[A-Za-z]{3}[-]?\d{4}$/;

                                return Promise.resolve(regex.test(control.value || ''));
                            },
                            error: {
                                message: 'Enter a valid course format (ex. : MAT-1000).'
                            },
                            validationType: ControlValidatorValidationType.Correction
                        },
                        {
                            key: 'duplicate-course-code',
                            validationFunction: undefined,
                            error: {
                                message: 'This course code already exists.'
                            },
                            validationType: ControlValidatorValidationType.Manual
                        }
                    ]
                )
            ]
        ),
        new FormGroup(
            'Live check username avaibility (async)',
            [
                new FormControl<string>(
                    'Username',
                    [
                        {
                            key: '',
                            validationFunction: async (control: FormControl<string>): Promise<boolean> => {
                                return new Promise(res => {
                                    setTimeout(() => res(![
                                        'John',
                                        'Jane',
                                        'Doe'
                                    ].includes(control.value || '')), 1200);
                                });
                            },
                            error: {
                                message: 'Username is not available'
                            },
                            validationType: ControlValidatorValidationType.OnGoing
                        }
                    ]
                )
            ]
        )
    ];

    waitingStatuses: boolean[];

    protected created(): void {
        this.waitingStatuses = new Array(this.formGroups.length).fill(false);
    }

    submit(formGroupIndex: number): void {
        let me: any = this;
        if (formGroupIndex === 4) {
            this.waitingStatuses[4] = true;
            setTimeout(() => {
                let control: FormControl<string> = me.formGroups[4].getControl('Course code') as FormControl<string>;
                control.validators
                    .find(v => v.key === 'duplicate-course-code')!
                    .validationFunction = (): Promise<boolean> => Promise.resolve(![
                        'AAA-0000',
                        'AAA-0001'
                    ].includes(control.value || ''));
                (me.$refs[me.formGroups[4].name] as MForm).submit(true);
                me.waitingStatuses[4] = false;
            }, 1000);
        }
    }

    reset(formGroupIndex: number): void {

    }
}

const AddSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-sandbox`, MFormSandbox);
    }
};

export default AddSandboxPlugin;
