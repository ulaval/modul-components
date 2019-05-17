import { PluginObject } from 'vue';
import { ABSTRACT_CONTROL_NAME } from '../../directives/directive-names';
import ScrollToPlugin from '../../utils/scroll-to/scroll-to';
import ToastServicePlugin from '../../utils/toast/toast-service.plugin';
import { FORM_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import MessagePlugin from '../message/message';
import ToastPlugin from '../toast/toast';
import { AbstractControlDirective } from './control-directive';
import { ClearErrorToast, ErrorToast, FocusOnFirstError } from './fallouts/built-in-form-action-fallouts';
import { MForm } from './form';
import { FormActionFallout } from './form-action-fallout';
import { MFormService } from './form-service';

declare module 'vue/types/vue' {
    interface Vue {
        $form: MFormService;
    }
}

export interface FormPluginOptions {
    formAfterActionEffects?: FormActionFallout[];
}

export const FormPlugin: PluginObject<any> = {
    install(v, options?: FormPluginOptions): void {
        v.prototype.$log.debug(FORM_NAME, 'plugin.install');

        v.use(I18nPlugin);
        v.use(MessagePlugin);
        v.use(ToastPlugin);
        v.use(ToastServicePlugin);
        v.use(ScrollToPlugin);
        v.directive(ABSTRACT_CONTROL_NAME, AbstractControlDirective);
        v.component(FORM_NAME, MForm);

        (v.prototype).$form = new MFormService(
            options && options.formAfterActionEffects ?
                options.formAfterActionEffects : [
                    ErrorToast,
                    ClearErrorToast,
                    FocusOnFirstError
                ]
        );
    }
};

export default FormPlugin;
