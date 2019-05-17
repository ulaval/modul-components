import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormArray } from '../../utils/form/form-array';
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
    rolesName: string[] = ['Sys admin', 'Unit admin', 'Conceptor', 'Assitant', 'Moderator', 'Student', 'Invited'];


    formGroups: FormGroup[] = [
        new FormGroup(
            {
                'Title': new FormControl<string>(
                    [
                        RequiredValidator('Title'),
                        MaxLengthValidator('Title', 20)
                    ]
                )
            }
        ),
        new FormGroup(
            {
                'Security answer': new FormControl<string>(
                    [
                        RequiredValidator('Security answer'),
                        MinLengthValidator('Security answer', 5)
                    ]
                )
            }
        ),
        new FormGroup(
            {
                'Postal code': new FormControl<string>(
                    [
                        RequiredValidator('Postal code'),
                        {
                            key: 'postal-code-format',
                            validationFunction: (control: FormControl<string>): boolean => {
                                const regex: RegExp = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

                                return regex.test(control.value || '');
                            },
                            error: {
                                message: 'Enter postal code.'
                            },
                            validationType: ControlValidatorValidationType.OnGoing
                        }
                    ]
                )
            }
        ),
        new FormGroup(
            {
                'Email': new FormControl<string>(
                    [
                        RequiredValidator('Email'),
                        EmailValidator('Email')
                    ]
                )
            }
        ),
        new FormGroup(
            {
                'Course code': new FormControl<string>(
                    [
                        RequiredValidator('Course code'),
                        MaxLengthValidator('Course code', 8, {
                            validationType: ControlValidatorValidationType.OnGoing
                        }),
                        {
                            key: 'course-code-format',
                            validationFunction: (control: FormControl<string>): boolean => {
                                const regex: RegExp = /^[A-Za-z]{3}[-]?\d{4}$/;

                                return regex.test(control.value || '');
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
                            validationType: ControlValidatorValidationType.External
                        }
                    ]
                )
            }
        ),
        new FormGroup(
            {
                'Username': new FormControl<string>(
                    [
                        RequiredValidator('Value', {
                            error: {
                                message: 'Username is required'
                            },
                            validationType: ControlValidatorValidationType.AtExit
                        }),
                        {
                            key: '',
                            validationFunction: async (control: FormControl<string>): Promise<boolean> => {
                                return new Promise(res => {
                                    if (control.value) {
                                        setTimeout(() => res(![
                                            'John',
                                            'Jane',
                                            'Doe'
                                        ].includes(control.value || '')), 2000);
                                    } else {
                                        res(false);
                                    }

                                });
                            },
                            async: true,
                            error: {
                                message: 'Username is not available'
                            },
                            validationType: ControlValidatorValidationType.AtExit
                        }

                    ]
                )
            }
        ),
        new FormGroup(
            {
                'Value': new FormControl<string>(
                    [
                        RequiredValidator('Value', {
                            error: {
                                message: 'Selectionnez le rôle'
                            }
                        })
                    ]
                )
            }
        ),
        new FormGroup(
            {
                roles: new FormArray(
                    this.rolesName.map(role => new FormControl<boolean>([], { initialValue: false }))
                    ,
                    [
                        {
                            key: 'selection-min-count',
                            validationFunction: (array: FormArray): boolean => {
                                return array.value.filter(c => c).length >= 2;
                            },
                            error: {
                                message: 'Select at least 2 roles'
                            },
                            validationType: ControlValidatorValidationType.OnGoing
                        },
                        {
                            key: 'selection-max-count',
                            validationFunction: (array: FormArray): boolean => {
                                return array.value.filter(c => c).length <= 5;
                            },
                            error: {
                                message: 'Select 5 roles or less'
                            },
                            validationType: ControlValidatorValidationType.OnGoing
                        }
                    ])
            }
        ),
        new FormGroup(
            {
                'Email': new FormControl<string>(
                    [
                        RequiredValidator('Email'),
                        EmailValidator('Email')
                    ]
                ),
                'Email confirmation': new FormControl<string>(
                    [
                        EmailValidator('Email confirmation')
                    ]
                )
            },
            [
                {
                    key: 'compare-email',
                    validationFunction: (control: FormGroup): boolean => {
                        return (
                            !(control.getControl('Email') as FormControl<string>).value
                            ||
                            ['Email', 'Email confirmation']
                                .map(cn => (control.getControl(cn) as FormControl<any>))
                                .every(fc => fc.value === (control.controls[0] as FormControl<any>).value)
                        );
                    },
                    error: {
                        message: `Emails don't match`
                    },
                    validationType: ControlValidatorValidationType.Correction
                }
            ]
        )
    ];



    submit(formGroupIndex: number): void {
        let me: any = this;

        if (formGroupIndex === 4) {
            setTimeout(() => {
                let control: FormControl<string> = me.formGroups[4].getControl('Course code') as FormControl<string>;

                control.validators
                    .find(v => v.key === 'duplicate-course-code')!
                    .validationFunction = (): boolean => (![
                        'AAA-0000',
                        'AAA-0001'
                    ].includes(control.value || ''));

                (me.$refs['form4'] as MForm).submit(true);
            }, 1000);
        }
    }

    reset(formGroupIndex: number): void {

    }
}

const FormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM_NAME}-sandbox`, MFormSandbox);
    }
};

export default FormSandboxPlugin;
