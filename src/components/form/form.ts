import { PluginObject } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Form } from '../../utils/form/form';
import { ModulVue } from '../../utils/vue/vue';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import { MMessageState } from '../message/message';
import WithRender from './form.html';

@WithRender
@Component
export class MForm extends ModulVue {
    @Prop()
    form: Form;

    @Prop({ default: false })
    hasOptionalFields: boolean;

    messageStateEror: MMessageState = MMessageState.Error;

    errors: string[] = [];

    get hasErrors(): boolean {
        return this.errors.length > 1;
    }

    onSubmit(): void {
        if (this.form) {
            this.errors = [];
            this.form.validateAll();

            if (this.form.nbFieldsThatHasError === 0) {
                this.$emit('submit');
            } else if (this.form.nbFieldsThatHasError === 1) {
                setTimeout(() => {
                    let fieldWithError: HTMLElement | null = this.$el.querySelector('.m--has-error input, .m--has-error textarea');
                    if (fieldWithError) {
                        (fieldWithError).focus();
                    }
                });
            } else {
                this.errors = this.form.getErrorsForSummary();
            }
        } else {
            this.$emit('submit');
        }
    }

    onReset(): void {
        this.errors = [];

        if (this.form) {
            this.form.reset();
        }

        this.$emit('reset');
    }
}


const FormPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(FORM, 'plugin.install');
        v.use(I18nPlugin);
        v.component(FORM, MForm);
    }
};

export default FormPlugin;
