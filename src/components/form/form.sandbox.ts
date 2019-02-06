import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FormField } from '../../utils/form/form-field/form-field';
import { FormValidation } from '../../utils/form/form-validation/form-validation';
import { FORM } from '../component-names';
import FormPlugin from './form';
import WithRender from './form.sandbox.html';

@WithRender
@Component
export class MFormSandbox extends Vue {
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
        })
    ];

    submit(formIndex: number): void {
    }

    reset(formIndex: number): void {
    }
}

const MFormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM}-sandbox`, MFormSandbox);
    }
};

export default MFormSandboxPlugin;
