import { PluginObject } from 'vue';
import { ABSTRACT_CONTROL_NAME } from '../../directives/directive-names';
import { FormClearToastBehavior, FormErrorFocusBehavior, FormErrorToastBehavior, MFormListener, MFormService } from '../../utils/form/form-service/form-service';
import ScrollToPlugin from '../../utils/scroll-to/scroll-to';
import ToastServicePlugin from '../../utils/toast/toast-service';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin from '../message/message';
import ToastPlugin from '../toast/toast';
import { AbstractControlDirective } from './abstract-control';
import { MForm } from './form';

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
        v.directive(ABSTRACT_CONTROL_NAME, AbstractControlDirective);
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
