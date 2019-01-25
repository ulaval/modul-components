import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
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
    title: string = '';
    description: string = '';
    location: string = '';
    formSent: any = '';

    form: Form = new Form({
        'titleField': new FormField<string>((): string => this.title, () => this.$refs.title as HTMLElement, [ValidationSandbox.validateRequired, ValidationSandbox.validateMaxLength]),
        'descriptionField': new FormField<string>((): string => this.description, () => this.$refs.description as HTMLElement, [ValidationSandbox.validateMaxLength]),
        'locationField': new FormField<string>((): string => this.location, () => this.$refs.location as HTMLElement, [ValidationSandbox.validateRequired, ValidationSandbox.validateMaxLength, ValidationSandbox.validateMinLength]),
        'passwordField': new FormField<string>((): string => '', () => this.$refs.password as HTMLElement),
        'confirmPasswordField': new FormField<string>((): string => '', () => this.$refs.confirmPassword as HTMLElement)
    }, [
            ValidationSandbox.validatePasswordMatch
        ]);

    maxTitleLength: number = ValidationSandbox.maxTitleLength;
    thresholdTitle: number = ValidationSandbox.thresholdTitle;
    maxDescriptionLength: number = ValidationSandbox.maxDescriptionLength;
    thresholdDescription: number = ValidationSandbox.thresholdDescription;
    minLocationLength: number = ValidationSandbox.minLocationLength;
    maxLocationLength: number = ValidationSandbox.maxLocationLength;
    thresholdLocation: number = ValidationSandbox.thresholdLocation;

    inputMaxWidthLarge: InputMaxWidth = InputMaxWidth.Large;
    inputMaxWidthSmall: InputMaxWidth = InputMaxWidth.Small;

    submit(): void {
        const data: any = {
            title: this.form.get('titleField')!.value,
            description: this.form.get('descriptionField')!.value,
            location: this.form.get('locationField')!.value,
            password: this.form.get('passwordField')!.value
        };

        this.$emit('submit', data);
        this.formSent = data;
    }
}

class ValidationSandbox {
    static readonly maxTitleLength: number = 8;
    static readonly thresholdTitle: number = 6;
    static readonly maxDescriptionLength: number = 20;
    static readonly thresholdDescription: number = 16;
    static readonly minLocationLength: number = 10;
    static readonly maxLocationLength: number = 40;
    static readonly thresholdLocation: number = 30;

    static validateRequired(value: any, params: { fieldName: string }): FormFieldValidation {
        if (!value) {
            return new FormFieldValidation(true, `${params.fieldName} is required.`, 'This field is required.');
        }
        return new FormFieldValidation();
    }

    static validateMaxLength(value: any, params: { maxLength: number, fieldName: string }): FormFieldValidation {
        if (value.length > params.maxLength) {
            let error: string = `${params.fieldName} can be at most ${params.maxLength} characters.`;
            return new FormFieldValidation(true, error, error);
        }
        return new FormFieldValidation();
    }

    static validateMinLength(value: any, params: { minLength: number, fieldName: string }): FormFieldValidation {
        if (value.length < params.minLength) {
            let error: string = `${params.fieldName} can be at least ${params.minLength} characters.`;
            return new FormFieldValidation(true, error, error);
        }
        return new FormFieldValidation();
    }

    static validatePasswordMatch(form: Form): FormValidation {
        if (form.get('passwordField')!.value !== form.get('confirmPasswordField')!.value) {
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
