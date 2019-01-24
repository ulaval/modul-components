import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
import { Form } from '../../utils/form/form';
import { FormFieldState } from '../../utils/form/form-field-state/form-field-state';
import { FormField } from '../../utils/form/form-field/form-field';
import { FORM } from '../component-names';
import WithRender from './form.sandbox.html';

@WithRender
@Component
export class MFormSandbox extends Vue {
    title: string = '';
    description: string = '';
    location: string = '';
    formSent: any = '';

    titleField: FormField<string> = new FormField((): string => this.title, ValidationSandbox.validateTitle);
    descriptionField: FormField<string> = new FormField((): string => this.description, ValidationSandbox.validateDescription);
    locationField: FormField<string> = new FormField((): string => this.location, ValidationSandbox.validateLocation);
    form: Form = new Form([this.titleField, this.descriptionField, this.locationField]);

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
            title: this.titleField.value,
            description: this.descriptionField.value,
            location: this.locationField.value
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

    static validateTitle(title: string): FormFieldState {
        if (!title) {
            return new FormFieldState(true, 'Title is required.', 'This field is required.');
        } else if (title.length > ValidationSandbox.maxTitleLength) {
            let error: string = `Title can be at most ${ValidationSandbox.maxTitleLength} characters.`;
            return new FormFieldState(true, error, error);
        }
        return new FormFieldState();
    }

    static validateDescription(description: string): FormFieldState {
        if (description.length > ValidationSandbox.maxDescriptionLength) {
            let error: string = `Description can be at most ${ValidationSandbox.maxDescriptionLength} characters.`;
            return new FormFieldState(true, error, error);
        }
        return new FormFieldState();
    }

    static validateLocation(location: string): FormFieldState {
        if (!location) {
            return new FormFieldState(true, 'Location is required.', 'Title is required.');
        } else if (location.length < ValidationSandbox.minLocationLength) {
            let error: string = `Location can be at least ${ValidationSandbox.minLocationLength} characters.`;
            return new FormFieldState(true, error, error);
        } else if (location.length > ValidationSandbox.maxLocationLength) {
            let error: string = `Location can be at most ${ValidationSandbox.maxLocationLength} characters.`;
            return new FormFieldState(true, error, error);
        }
        return new FormFieldState();
    }
}

const MFormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${FORM}-sandbox`, MFormSandbox);
    }
};

export default MFormSandboxPlugin;
