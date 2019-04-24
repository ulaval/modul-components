import { PluginObject } from 'vue';
import { ABSTRACT_CONTROL_NAME } from '../../directives/directive-names';
import ScrollToPlugin from '../../utils/scroll-to/scroll-to';
import ToastServicePlugin from '../../utils/toast/toast-service.plugin';
import { FORM } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin from '../message/message';
import ToastPlugin from '../toast/toast';
import { AbstractControlDirective } from './abstract-control-directive';
import { MForm } from './form';
import { FormAfterActionEffect } from './form-after-action-effect';
import { ClearErrorToast, ErrorToast, FocusOnFirstError } from './form-after-action-effects';
import { MFormService } from './form-service';

declare module 'vue/types/vue' {
    interface Vue {
        $form: MFormService;
    }
}

export interface FormPluginOptions {
    formAfterActionEffects: FormAfterActionEffect[];
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
        if (options) {
            form = new MFormService(options.formAfterActionEffects);
        } else {
            form = new MFormService([
                ErrorToast,
                ClearErrorToast,
                FocusOnFirstError
            ]);
        }

        (v.prototype).$form = form;
    }
};

export default FormPlugin;
