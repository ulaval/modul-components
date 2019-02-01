import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
import { Form } from '../../utils/form/form';
import { FormFieldValidation } from '../../utils/form/form-field-validation/form-field-validation';
import { FieldValidationCallback, FormField } from '../../utils/form/form-field/form-field';
import { FormValidation } from '../../utils/form/form-validation/form-validation';
import { FORM } from '../component-names';
import FormPlugin from './form';
import WithRender from './form.sandbox.html';

@WithRender
@Component
export class MFormSandbox extends Vue {
    title: string = '';
    description: string = '';
    location: string = '';
    formSent: any = '';

    maxTitleLength: number = ValidationSandbox.maxTitleLength;
    thresholdTitle: number = ValidationSandbox.thresholdTitle;
    maxDescriptionLength: number = ValidationSandbox.maxDescriptionLength;
    thresholdDescription: number = ValidationSandbox.thresholdDescription;
    minDescriptionLength: number = ValidationSandbox.minDescriptionLength;
    minLocationLength: number = ValidationSandbox.minLocationLength;
    maxLocationLength: number = ValidationSandbox.maxLocationLength;
    thresholdLocation: number = ValidationSandbox.thresholdLocation;

    inputMaxWidthLarge: InputMaxWidth = InputMaxWidth.Large;
    inputMaxWidthSmall: InputMaxWidth = InputMaxWidth.Small;

    form: Form = new Form({
        'titleField': new FormField<string>((): string => this.title, [ValidationSandbox.validateRequired('Title'), ValidationSandbox.validateMaxLength('Title', this.maxTitleLength)]),
        'descriptionField': new FormField<string>((): string => this.description, [ValidationSandbox.validateRequired('Description'), ValidationSandbox.validateMinLength('Description', this.minDescriptionLength), ValidationSandbox.validateMaxLength('Description', this.maxDescriptionLength)]),
        'locationField': new FormField<string>((): string => this.location, ValidationSandbox.validateLocation()),
        'passwordField': new FormField<string>((): string => ''),
        'confirmPasswordField': new FormField<string>((): string => '')
    }, [ValidationSandbox.validatePasswordMatch]);

    submit(): void {
        const data: any = {
            title: this.form.get('titleField').value,
            description: this.form.get('descriptionField').value,
            location: this.form.get('locationField').value,
            password: this.form.get('passwordField').value
        };

        this.$emit('submit', data);
        this.formSent = data;
    }
}

class ValidationSandbox {
    static readonly maxTitleLength: number = 8;
    static readonly thresholdTitle: number = 6;
    static readonly minDescriptionLength: number = 10;
    static readonly maxDescriptionLength: number = 20;
    static readonly thresholdDescription: number = 16;
    static readonly minLocationLength: number = 16;
    static readonly maxLocationLength: number = 40;
    static readonly thresholdLocation: number = 30;


    static validateRequired(fieldName: string): FieldValidationCallback {
        return (value: any) => {
            if (!value) {
                return new FormFieldValidation(true, [`${fieldName} is required.`], ['This field is required.']);
            }
            return new FormFieldValidation();
        };
    }

    static validateMaxLength(fieldName: string, maxLength: number): FieldValidationCallback {
        return (value: any) => {
            if (value.length > maxLength) {
                let error: string = `<strong>${fieldName}</strong> can be at most ${maxLength} characters.`;
                return new FormFieldValidation(true, [error], [error]);
            }
            return new FormFieldValidation();
        };
    }

    static validateMinLength(fieldName: string, minLength: number): FieldValidationCallback {
        return (value: any) => {
            if (value.length < minLength) {
                let error: string = `<strong>${fieldName}</strong> can be at least ${minLength} characters.`;
                return new FormFieldValidation(true, [error], [error]);
            }
            return new FormFieldValidation();
        };
    }

    // Other pattern
    static validateLocation(): FieldValidationCallback[] {
        return [(value: any) => {
            let validation: FormFieldValidation = new FormFieldValidation();
            if (!value) {
                validation.isError = true;
                validation.errorMessages = ['This field is required.'];
                validation.errorMessagesSummary = [`Location is required.`];
            }

            if (value.length < this.minLocationLength) {
                let error: string = `<strong>Location</strong> can be at least ${this.minLocationLength} characters.`;
                validation.isError = true;
                validation.errorMessages = validation.errorMessages.concat([error]);
                validation.errorMessagesSummary = validation.errorMessagesSummary.concat([error]);
            }

            if (value.length > this.maxLocationLength) {
                validation.isError = true;
                let error: string = `<strong>Location</strong> can be at most ${this.maxLocationLength} characters.`;
                validation.errorMessages = validation.errorMessages.concat([error]);
                validation.errorMessagesSummary = validation.errorMessagesSummary.concat([error]);
            }

            return validation;
        }];
    }

    static validatePasswordMatch(form: Form): FormValidation {
        if (form.get('passwordField').value !== form.get('confirmPasswordField').value) {
            return new FormValidation(true, 'Passwords must match');
        }
        return new FormValidation();
    }
}

const MFormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM}-sandbox`, MFormSandbox);
    }
};

export default MFormSandboxPlugin;
