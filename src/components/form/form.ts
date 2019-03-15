import { Component, Emit, Prop } from 'vue-property-decorator';
import { Form } from '../../utils/form/form';
import { MFormEvents, MFormListener } from '../../utils/form/form-service/form-service';
import { ModulVue } from '../../utils/vue/vue';
import { MMessageState } from '../message/message';
import WithRender from './form.html?style=./form.scss';


@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    public form: Form;

    @Prop()
    public requiredMarker: boolean;

    public messageStateError: MMessageState = MMessageState.Error;
    public errors: string[] = [];

    listeners: MFormListener[];

    @Emit('submit')

    public onSubmit(): void { }

    @Emit('reset')
    public onReset(): void { }

    public get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    created(): void {
        this.listeners = this.$form.listeners;
    }

    public submit(): void {
        this.emit(MFormEvents.formErrorClear);

        if (this.form) {
            this.errors = [];
            this.form.validateAll();

            if (this.form.isValid) {
                this.onSubmit();
            } else {
                this.handleErrors();
            }
        } else {
            this.onSubmit();
        }
    }

    public reset(): void {
        this.errors = [];
        this.emit(MFormEvents.formErrorClear);

        if (this.form) {
            this.form.reset();
        }
        this.onReset();
    }

    public setListeners(listeners: MFormListener[]): void {
        this.listeners = listeners;
    }

    private handleErrors(): void {
        this.emit(MFormEvents.formError, {
            form: this.form,
            totalNbOfErrors: this.form.nbFieldsThatHasError,
            errorsToShowInMessagesCallback: (errors: string[]) => {
                this.errors = errors;
            }
        });
    }

    emit(eventType: MFormEvents, params?: any): void {
        this.listeners
            .filter((listener: MFormListener) => listener.eventType === eventType)
            .forEach((listener: MFormListener) => listener.callback(params));
    }
}

