import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

const STATE_DEFAULT = 'default';
const STATE_DISABLED = 'disabled';
const STATE_ERROR = 'error';
const STATE_VALID = 'valid';

export interface InputStateMixin {
    isDisabled: boolean;
    hasError: boolean;
    isValid: boolean;
}

@Component
export class InputState extends Vue implements InputStateMixin {
    @Prop({ default: STATE_DEFAULT })
    public state: string;
    @Prop({ default: '' })
    public errorMessage: string;
    @Prop({ default: '' })
    public validMessage: string;
    @Prop({ default: '' })
    public helperMessage: string;

    public get isDisabled(): boolean {
        return this.propState == STATE_DISABLED;
    }

    public get hasError(): boolean {
        return this.propState == STATE_ERROR;
    }

    public get isValid(): boolean {
        return this.propState == STATE_VALID;
    }

    private get propState(): string {
        let state: string = this.state == STATE_DISABLED || this.state == STATE_ERROR || this.state == STATE_VALID ? this.state : STATE_DEFAULT;
        if (state != STATE_DISABLED && this.propsErrorMessage != '') {
            state = STATE_ERROR;
        } else if (state != STATE_DISABLED && this.propsValidMessage != '') {
            state = STATE_VALID;
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
