import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { I18N_NAME } from '../directive-names';
import { Messages } from '../../utils/i18n/i18n';

const I18nDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        if (binding.arg) {
            let expression = binding.expression;
            const modifiers: string[] = Object.getOwnPropertyNames(binding.modifiers);
            const options = binding.value || {};

            if (modifiers.length > 0) {
                expression = Vue.prototype.$i18n.translate(
                    modifiers[0],
                    options.params,
                    options.nb,
                    options.modifier
                );
            }

            el.setAttribute(binding.arg, expression);
        }
    }
};

const I18nDirectivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(I18N_NAME, I18nDirective);
    }
};

export default I18nDirectivePlugin;
