import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FormField } from '../../utils/form/form-field/form-field';
import { FormValidation } from '../../utils/form/form-validation/form-validation';
import { FORM } from '../component-names';
import { MMessageState } from '../message/message';
import FormPlugin from './form';
import WithRender from './form.sandbox.html';

@WithRender
@Component
export class MFormSandbox extends Vue {
    serverResponses: any[] = [
        { status: 100, messageState: MMessageState.Information, title: 'Info', message: 'Here is some information about your request treament..' },
        { status: 400, messageState: MMessageState.Warning, title: 'There was an error on your end', message: 'The error was...' },
        { status: 500, messageState: MMessageState.Error, title: 'There was an error on our end', message: 'Please try again later' }
    ];
    serverResponse: any = this.serverResponses[0];
    hasServerResponse: boolean = false;
    forms: Form[] = [
        new Form({
            'field-1': new FormField<string>((): string => '', [])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-1 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-1 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }]),
            'field-2': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-2 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }])
        }),
        new Form({
            'field-1': new FormField<string>((): string => 'predefined value', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-1 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }])
        }),
        new Form({
            'field-1': new FormField<string>((): string => 'predefined value', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-1 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }]),
            'field-2': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-2 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, [`the <strong>field-1</strong> is required`], ['this field is required']);
                }
                return new FormFieldValidation();
            }]),
            'field-2': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, ['the field-2 is required'], ['this field is required']);
                }
                return new FormFieldValidation();
            }])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (value.length < 5) {
                    return new FormFieldValidation(true, [`the field-1 should be 5 letters at least`], ['this field should be 5 letters at least']);
                }
                return new FormFieldValidation();
            }]),
            'field-2': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (value.length < 5) {
                    return new FormFieldValidation(true, [`the field-2 should be 5 letters at least`], ['this field should be 5 letters at least']);
                }
                return new FormFieldValidation();
            }], { messageAfterTouched: false })
        }),
        new Form({
            'field-1': new FormField<string>((): string => 'a value', []),
            'field-2': new FormField<string>((): string => 'a different value', [])
        }, [(form: Form): FormValidation => {
            if (form.get('field-1').value !== form.get('field-2').value) {
                return new FormValidation(true, 'Fields must match');
            }
            return new FormValidation();
        }]),
        new Form({
            'field-1': new FormField<string>((): string => '', [])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '',
                [
                    (value: string): FormFieldValidation => {
                        if (value.length < 5) {
                            return new FormFieldValidation(true, [`the field-1 should be 5 letters at least`], ['this field should be 5 letters at least']);
                        }
                        return new FormFieldValidation();
                    },
                    (value: string): FormFieldValidation => {
                        if (/\d/.test(value)) {
                            return new FormFieldValidation(true, [`the field-1 cannot have number`], ['this field cannot have number']);
                        }
                        return new FormFieldValidation();
                    }
                ]
            )
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [])
        }),
        new Form({
            'field-1': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, [`the <strong>field-1</strong> is required`], ['this field is required']);
                }
                return new FormFieldValidation();
            }]),
            'field-2': new FormField<string>((): string => '', [(value: string): FormFieldValidation => {
                if (!value) {
                    return new FormFieldValidation(true, [`the <strong>field-2</strong> is required`], ['this field is required']);
                }
                return new FormFieldValidation();
            }])
        })
    ];

    submit(formIndex: number): void {
        if (formIndex === 12) {
            this.hasServerResponse = true;
        }
    }

    reset(formIndex: number): void {
        if (formIndex === 12) {
            this.hasServerResponse = false;
        }
    }
}

const MFormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM}-sandbox`, MFormSandbox);
    }
};

export default MFormSandboxPlugin;
