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
    @Prop()
    public errorMessage: string;
    @Prop()
    public validMessage: string;
    @Prop()
    public helperMessage: string;

    public get isDisabled(): boolean {
        return this.propState == InputStateValue.Disabled;
    }

    public get hasError(): boolean {
        return !!this.errorMessage;
    }

    public get hasHelper(): boolean {
        return !!this.helperMessage;
    }

    public get isValid(): boolean {
        return !!this.validMessage;
    }

    public get propState(): InputStateValue {
        return this.state == InputStateValue.Disabled || this.state == InputStateValue.Error || this.state == InputStateValue.Valid ? this.state
            : InputStateValue.Default;
    }
}
