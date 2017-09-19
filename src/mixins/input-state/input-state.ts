import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

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
    @Prop()
    public errorMessage: string | undefined;
    @Prop()
    public validMessage: string | undefined;
    @Prop()
    public helperMessage: string | undefined;

    private internalState: InputStateValue = InputStateValue.Default;
    private internalErrorMessage: string | undefined;
    private internalValidMessage: string | undefined;
    private internalHelperMessage: string | undefined;

    protected created(): void {
        this.propState = this.state;
        this.propErrorMessage = this.errorMessage;
        this.propValidMessage = this.validMessage;
        this.propHelperMessage = this.helperMessage;
    }

    public get isDisabled(): boolean {
        return this.propState == InputStateValue.Disabled;
    }

    public get hasError(): boolean {
        return this.propState == InputStateValue.Error;
    }

    public get isValid(): boolean {
        return this.propState == InputStateValue.Valid;
    }

    public set propState(state: InputStateValue) {
        this.internalState =
            state == InputStateValue.Disabled || state == InputStateValue.Error || state == InputStateValue.Valid ? state : InputStateValue.Default;
    }

    public get propState(): InputStateValue {
        return this.internalState;
    }

    public set propErrorMessage(message: string | undefined) {
        if (!this.isDisabled && message != '' && message != undefined) {
            this.propState = InputStateValue.Error;
            this.internalErrorMessage = message;
        } else {
            this.internalErrorMessage = undefined;
        }
    }

    public get propErrorMessage(): string | undefined {
        return this.internalErrorMessage;
    }

    public set propValidMessage(message: string | undefined) {
        if (!this.isDisabled && this.propState != InputStateValue.Error && message != '' && message != undefined) {
            this.propState = InputStateValue.Valid;
            this.internalValidMessage = message;
        } else {
            this.internalValidMessage = undefined;
        }
    }

    public get propValidMessage(): string | undefined {
        return this.internalValidMessage;
    }

    public set propHelperMessage(message: string | undefined) {
        this.internalHelperMessage = message == '' ? undefined : message;
    }

    public get propHelperMessage(): string | undefined {
        return this.internalHelperMessage;
    }

    @Watch('state')
    private stateChanged(state: InputStateValue): void {
        this.propState = state;
    }

    @Watch('errorMessage')
    private errorMessageChanged(message: string): void {
        this.propErrorMessage = message;
    }

    @Watch('validMessage')
    private validMessageChanged(message: string): void {
        this.propValidMessage = message;
    }

    @Watch('helperMessage')
    private helperMessageChanged(message: string): void {
        this.helperMessage = message;
    }
}
