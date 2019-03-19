import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';

export enum InputStateValue {
    Default = 'default',
    Disabled = 'disabled',
    Readonly = 'readonly',
    Waiting = 'waiting',
    Error = 'error',
    Valid = 'valid'
}

export enum InputStateTagStyle {
    Default = 'default',
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
    P = 'p'
}

export interface InputStateMixin {
    active: boolean;
    isDisabled: boolean;
    isReadonly: boolean;
    isWaiting: boolean;
    hasError: boolean;
    isValid: boolean;
    state: string;
    hasErrorMessage: boolean;
    hasValidMessage: boolean;
    hasHelperMessage: boolean;
    hasValidationMessage: boolean;

    helperMessage: string;
    validMessage: string;
    errorMessage: string;

    readonly: boolean;
    disabled: boolean;
    getInput(): HTMLElement | undefined;
}

export interface InputStateInputSelector {
    selector: string;
}

@Component
export class InputState extends ModulVue implements InputStateMixin {
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;
    @Prop()
    public error: boolean;
    @Prop()
    public valid: boolean;
    @Prop()
    public errorMessage: string;
    @Prop()
    public validMessage: string;
    @Prop()
    public helperMessage: string;
    @Prop({
        default: InputStateTagStyle.Default,
        validator: value =>
            value === InputStateTagStyle.Default ||
            value === InputStateTagStyle.H1 ||
            value === InputStateTagStyle.H2 ||
            value === InputStateTagStyle.H3 ||
            value === InputStateTagStyle.H4 ||
            value === InputStateTagStyle.H5 ||
            value === InputStateTagStyle.H6 ||
            value === InputStateTagStyle.P
    })
    public tagStyle: string;
    @Prop()
    public readonly: boolean;

    public get active(): boolean {
        return !this.isDisabled && !this.isWaiting && !this.readonly;
    }

    public get isDisabled(): boolean {
        return this.state === InputStateValue.Disabled;
    }

    public get isReadonly(): boolean {
        return this.state === InputStateValue.Readonly;
    }

    public get isWaiting(): boolean {
        return this.state === InputStateValue.Waiting;
    }

    public get hasError(): boolean {
        return this.state === InputStateValue.Error;
    }

    public get isValid(): boolean {
        return this.state === InputStateValue.Valid;
    }

    public get state(): InputStateValue {
        if (this.readonly) {
            return InputStateValue.Readonly;
        }

        if (this.disabled) {
            return InputStateValue.Disabled;
        }

        if (this.waiting) {
            return InputStateValue.Waiting;
        }

        if (this.hasErrorMessage || this.error) {
            return InputStateValue.Error;
        }

        if (this.hasValidMessage || this.valid) {
            return InputStateValue.Valid;
        }

        return InputStateValue.Default;
    }

    public get hasErrorMessage(): boolean {
        return (!!this.errorMessage || this.errorMessage === ' ') && !this.disabled && !this.waiting;
    }

    public get hasValidMessage(): boolean {
        return (!!this.validMessage || this.validMessage === ' ') && !this.disabled && !this.waiting && !this.hasErrorMessage;
    }

    public get hasHelperMessage(): boolean {
        return (!!this.helperMessage || this.helperMessage === ' ') && !this.disabled && !this.waiting;
    }

    public get hasValidationMessage(): boolean {
        return (this.hasErrorMessage || this.hasValidMessage || this.hasHelperMessage) && this.active;
    }

    public getInput(): HTMLElement | undefined {
        const selector: string = this.as<InputStateInputSelector>().selector || 'input, textarea, [contenteditable=true]';
        const elements: NodeListOf<Element> = this.$el.querySelectorAll(selector);
        if (elements.length > 1) {
            throw new Error(`Input state can manage 1 and only 1 nested editable element (${selector})`);
        }
        return elements[0] as HTMLElement | undefined;
    }
}
