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
    @Prop({ default: false })
    public waiting: boolean;
    @Prop()
    public errorMessage: string;
    @Prop()
    public validMessage: string;
    @Prop()
    public helperMessage: string;

    public get isDisabled(): boolean {
        return this.propState == InputStateValue.Disabled || this.propState == InputStateValue.Waiting;
    }

    public get isWaiting(): boolean {
        return this.propState == InputStateValue.Waiting;
    }

    public get hasError(): boolean {
        return this.propState == InputStateValue.Error ;
    }

    public get hasHelper(): boolean {
        return !!this.helperMessage || this.helperMessage == ' ';
    }

    public get isValid(): boolean {
        return this.propState == InputStateValue.Valid;
    }

    public get propState(): InputStateValue {
        let state: InputStateValue = this.state == InputStateValue.Disabled || this.state == InputStateValue.Waiting || this.state == InputStateValue.Error || this.state == InputStateValue.Valid ? this.state
            : InputStateValue.Default;
        if (!this.disabled && !this.waiting ) {
            if ((!!this.errorMessage) || this.errorMessage == ' ') {
                state = InputStateValue.Error;
            } else if ((!!this.validMessage) || this.validMessage == ' ') {
                state = InputStateValue.Valid;
            }
        } else {
            state = this.disabled ? InputStateValue.Disabled : InputStateValue.Waiting;
        }
        return state;
    }
}
