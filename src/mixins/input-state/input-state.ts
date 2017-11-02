import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export enum InputStateValue {
    Default = 'default',
    Disabled = 'disabled',
    Error = 'error',
    Valid = 'valid'
}

export interface InputStateMixin {
    hasError: boolean;
    isDisabled: boolean;
    isValid: boolean;
    hasHelper: boolean;
}

@Component
export class InputState extends Vue implements InputStateMixin {
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public error: boolean;
    @Prop({ default: false })
    public valid: boolean;
    @Prop()
    public errorMessage: string;
    @Prop()
    public validMessage: string;
    @Prop()
    public helperMessage: string;

    public get isDisabled(): boolean {
        let disabled: boolean = this.state == InputStateValue.Disabled;
        return disabled;
    }

    public get hasError(): boolean {
        return this.state == InputStateValue.Error;
    }

    public get hasHelper(): boolean {
        return !!this.helperMessage || this.helperMessage == ' ';
    }

    public get isValid(): boolean {
        return this.state == InputStateValue.Valid;
    }

    public get state(): InputStateValue {
        let state: InputStateValue;
        if (!this.disabled) {
            if (this.hasErrorMessage || this.error) {
                state = InputStateValue.Error;
            } else if (this.hasValidMessage || this.valid) {
                state = InputStateValue.Valid;
            } else {
                state = InputStateValue.Default;
            }
        } else {
            state = InputStateValue.Disabled;
        }
        return state;
    }

    private get hasErrorMessage(): boolean {
        return !!this.errorMessage || this.errorMessage == ' ';
    }

    private get hasValidMessage(): boolean {
        return !!this.validMessage || this.validMessage == ' ';
    }
}
