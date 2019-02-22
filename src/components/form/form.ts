import { PluginObject } from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';
import { FORM_FIELD_NAME } from '../../directives/directive-names';
import { Form } from '../../utils/form/form';
import { ModulVue } from '../../utils/vue/vue';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin, { MMessageState } from '../message/message';
import { FormFieldDirective } from './form-field';
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
        if (this.form) {
            this.errors = [];
            this.form.validateAll();

            if (this.form.nbFieldsThatHasError === 0 && this.form.nbOfErrors === 0) {
                this.onSubmit();
            } else if (this.form.nbFieldsThatHasError === 1) {
                if (this.form.nbOfErrors > 0) {
                    this.errors = this.form.getErrorsForSummary();
                }
                this.form.focusFirstFieldWithError();
            } else {
                this.errors = this.form.getErrorsForSummary();
            }
        } else {
            this.onSubmit();
        }
    }

    public reset(): void {
        this.errors = [];

        if (this.form) {
            this.form.reset();
        }
        this.onReset();
    }
}


const FormPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(FORM, 'plugin.install');
        v.use(I18nPlugin);
        v.use(MessagePlugin);
        v.directive(FORM_FIELD_NAME, FormFieldDirective);
        v.component(FORM, MForm);
    }
};

export default FormPlugin;
