import { PluginObject } from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';
import { Form } from '../../utils/form/form';
import { MFormEvents } from '../../utils/form/form-service/form-service';
import { ModulVue } from '../../utils/vue/vue';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin, { MMessageState } from '../message/message';
import FormFieldDirectivePlugin from './form-field';
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

    @Emit('submit')
    public onSubmit(): void { }

    @Emit('reset')
    public onReset(): void { }

    public get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public submit(): void {
        this.$form.emit(MFormEvents.formErrorClear);

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
        this.$form.emit(MFormEvents.formErrorClear);

        if (this.form) {
            this.form.reset();
        }

        this.onReset();
    }

    public get shouldShowErrorSummary(): boolean {
        return this.form.nbFieldsThatHasError > 1 || this.form.nbOfErrors > 0;
    }

    private handleErrors(): void {
        this.errors = this.form.getErrorsForSummary();
        this.$form.emit(MFormEvents.formError, {
            form: this.form,
            totalNbOfErrors: this.form.totalNbOfErrors
        });
    }
}


const FormPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(FORM, 'plugin.install');
        v.use(I18nPlugin);
        v.use(MessagePlugin);
        v.use(FormFieldDirectivePlugin);
        v.component(FORM, MForm);
    }
};

export default FormPlugin;
