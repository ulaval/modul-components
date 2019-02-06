import { PluginObject } from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';
import { FORM_FIELD_NAME } from '../../directives/directive-names';
import { Form } from '../../utils/form/form';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin, { MMessageState } from '../message/message';
import { MToastPosition, MToastState } from '../toast/toast';
import { FormFieldDirective } from './form-field';
import WithRender from './form.html?style=./form.scss';

@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    public form: Form;

    @Prop({ default: true })
    public showErrorsInToast: boolean;

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
        this.$toast.clear();
        if (this.form) {
            this.errors = [];
            this.form.validateAll();

            if (this.form.isValid) {
                this.onSubmit();
            } else {
                if (this.shouldShowErrorSummary) {
                    this.errors = this.form.getErrorsForSummary();
                }
                if (this.shouldFocusFirstField) {
                    this.form.focusFirstFieldWithError();
                }
                if (this.shouldShowErrorInToast) {
                    let htmlString: string = this.$i18n.translate('m-form:multipleErrorsToCorrect', { totalNbofErrors: this.form.totalNbofErrors }, undefined, undefined, undefined, FormatMode.Sprintf);
                    this.$toast.show({
                        position: MToastPosition.TopCenter,
                        state: MToastState.Error,
                        text: `<p>${htmlString}</p>`
                    });
                }
            }
        } else {
            this.onSubmit();
        }
    }

    public reset(): void {
        this.$toast.clear();
        this.errors = [];

        if (this.form) {
            this.form.reset();
        }

        this.onReset();
    }

    private get shouldShowErrorSummary(): boolean {
        return this.form.nbFieldsThatHasError > 1 || this.form.nbOfErrors > 0;
    }

    private get shouldFocusFirstField(): boolean {
        return this.form.nbFieldsThatHasError > 0;
    }

    private get shouldShowErrorInToast(): boolean {
        return this.showErrorsInToast && this.form.totalNbofErrors > 1;
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
