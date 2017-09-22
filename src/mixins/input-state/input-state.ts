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
    @Prop({ default: InputStateValue.Default })
    public state: InputStateValue;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop()
    public errorMessage: string;
    @Prop()
    public validMessage: string;
    @Prop()
    public helperMessage: string;

    private valid: boolean;
    private error: boolean;

    public get isDisabled(): boolean {
        return this.propState == InputStateValue.Disabled;
    }

    public get hasError(): boolean {
        return this.propState == InputStateValue.Error;
    }

    public get hasHelper(): boolean {
        return !!this.helperMessage || this.helperMessage == ' ';
    }

    public get isValid(): boolean {
        return this.propState == InputStateValue.Valid;
    }

    public get propState(): InputStateValue {
        let state: InputStateValue = this.state == InputStateValue.Disabled || this.state == InputStateValue.Error || this.state == InputStateValue.Valid ? this.state
        : InputStateValue.Default;
        if (!this.disabled) {
            if (this.hasErrorMessage) {
                state = InputStateValue.Error;
            } else if ((this.hasValidMessage)) {
                state = InputStateValue.Valid;
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
