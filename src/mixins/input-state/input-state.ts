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
    @Prop({ default: '' })
    public errorMessage: string;
    @Prop({ default: '' })
    public validMessage: string;
    @Prop({ default: '' })
    public helperMessage: string;

    private internalState: InputStateValue = InputStateValue.Default;
    private internalErrorMessage: string = '';
    private internalValidMessage: string = '';
    private internalHelperMessage: string = '';

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

    private set propState(state: InputStateValue) {
        this.internalState =
            state == InputStateValue.Disabled || state == InputStateValue.Error || state == InputStateValue.Valid ? state : InputStateValue.Default;
    }

    private get propState(): InputStateValue {
        return this.internalState;
    }

    private set propErrorMessage(message: string) {
        this.internalErrorMessage = message;

        if (!this.isDisabled && this.internalErrorMessage != '') {
            this.propState = InputStateValue.Error;
        }
    }

    private get propErrorMessage(): string {
        return this.internalErrorMessage;
    }

    private set propValidMessage(message: string) {
        this.internalValidMessage = message;
        if (!this.isDisabled && this.propState != InputStateValue.Error && this.propValidMessage != '') {
            this.propState = InputStateValue.Valid;
        }
    }

    private get propValidMessage(): string {
        return this.internalValidMessage;
    }

    private set propHelperMessage(message: string) {
        this.internalHelperMessage = message;
    }

    private get propHelperMessage(): string {
        return this.internalHelperMessage;
    }
}
