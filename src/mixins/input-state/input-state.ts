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
}

@Component
export class InputState extends Vue implements InputStateMixin {
    @Prop({ default: InputStateValue.Default })
    public state: InputStateValue;
    @Prop({ default: '' })
    public errorMessage: string;
    @Prop({ default: '' })
    public validMessage: string;
    @Prop({ default: '' })
    public helperMessage: string;

    public get isDisabled(): boolean {
        return this.propState == InputStateValue.Disabled;
    }

    public get hasError(): boolean {
        return this.propState == InputStateValue.Error;
    }

    public get isValid(): boolean {
        return this.propState == InputStateValue.Valid;
    }

    private get propState(): InputStateValue {
        let state: InputStateValue =
            this.state == InputStateValue.Disabled || this.state == InputStateValue.Error || this.state == InputStateValue.Valid ? this.state : InputStateValue.Default;
        if (state != InputStateValue.Disabled && this.propsErrorMessage != '') {
            state = InputStateValue.Error;
        } else if (state != InputStateValue.Disabled && this.propsValidMessage != '') {
            state = InputStateValue.Valid;
        }
        return state;
    }

    private get propsErrorMessage(): string {
        return this.errorMessage;
    }

    private get propsValidMessage(): string {
        return this.validMessage;
    }
}
