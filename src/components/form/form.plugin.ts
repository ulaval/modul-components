import { PluginObject } from 'vue';
import { FORM_FIELD_NAME } from '../../directives/directive-names';
import { FormClearToastBehavior, FormErrorFocusBehavior, FormErrorToastBehavior, MFormListener, MFormService } from '../../utils/form/form-service/form-service';
import ScrollToPlugin from '../../utils/scroll-to/scroll-to';
import ToastServicePlugin from '../../utils/toast/toast-service.plugin';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin from '../message/message';
import ToastPlugin from '../toast/toast';
import { MForm } from './form';
import { FormFieldDirective } from './form-field';

declare module 'vue/types/vue' {
    interface Vue {
        $form: MFormService;
    }
}

export interface FormPluginOptions {
    formListeners: MFormListener[];
}

export const FormPlugin: PluginObject<any> = {
    install(v, options?: FormPluginOptions): void {
        v.prototype.$log.debug(FORM, 'plugin.install');

        v.use(I18nPlugin);
        v.use(MessagePlugin);
        v.use(ToastPlugin);
        v.use(ToastServicePlugin);
        v.use(ScrollToPlugin);
        v.directive(FORM_FIELD_NAME, FormFieldDirective);
        v.component(FORM, MForm);

        let form: MFormService;
        if (options && options.formListeners) {
            form = new MFormService(options.formListeners);
        } else {
            form = new MFormService([
                new FormErrorToastBehavior(),
                new FormClearToastBehavior(),
                new FormErrorFocusBehavior()]);
        }

        (v.prototype).$form = form;

    }
};

export default FormPlugin;
