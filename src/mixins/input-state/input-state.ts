import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export enum InputStateValue {
    Default = 'default',
    Disabled = 'disabled',
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
    isWaiting: boolean;
    hasError: boolean;
    isValid: boolean;
    state: string;
    hasErrorMessage: boolean;
    hasValidMessage: boolean;
    hasHelperMessage: boolean;

    helperMessage: string;
    validMessage: string;
    errorMessage: string;

    disabled: boolean;
}

@Component
export class InputState extends Vue implements InputStateMixin {
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
            value == InputStateTagStyle.Default ||
            value == InputStateTagStyle.H1 ||
            value == InputStateTagStyle.H2 ||
            value == InputStateTagStyle.H3 ||
            value == InputStateTagStyle.H4 ||
            value == InputStateTagStyle.H5 ||
            value == InputStateTagStyle.H6 ||
            value == InputStateTagStyle.P
    })
    public tagStyle: string;

    public get active(): boolean {
        return !this.isDisabled && !this.isWaiting;
    }

    public get isDisabled(): boolean {
        return this.state == InputStateValue.Disabled;
    }

    public get isWaiting(): boolean {
        return this.state == InputStateValue.Waiting;
    }

    public get hasError(): boolean {
        return this.state == InputStateValue.Error;
    }

    public get isValid(): boolean {
        return this.state == InputStateValue.Valid;
    }

    public get state(): InputStateValue {
        let state: InputStateValue;
        if (!this.disabled) {
            if (!this.waiting) {
                if (this.hasErrorMessage || this.error) {
                    state = InputStateValue.Error;
                } else if (this.hasValidMessage || this.valid) {
                    state = InputStateValue.Valid;
                } else {
                    state = InputStateValue.Default;
                }
            } else {
                state = InputStateValue.Waiting;
            }
        } else {
            state = InputStateValue.Disabled;
        }
        return state;
    }

    public get hasErrorMessage(): boolean {
        return (!!this.errorMessage || this.errorMessage == ' ') && !this.disabled && !this.waiting;
    }

    public get hasValidMessage(): boolean {
        return (!!this.validMessage || this.validMessage == ' ') && !this.disabled && !this.waiting && !this.hasErrorMessage;
    }

    public get hasHelperMessage(): boolean {
        return (!!this.helperMessage || this.helperMessage == ' ') && !this.disabled && !this.waiting;
    }
}
