import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { I_18_N } from '../directive-names';
import { Messages } from '../../utils/i18n/i18n';
import { stringToObject } from '../../utils/str/str';

const I18nDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        if (binding.arg) {
            let expression = binding.expression;
            const modifiers: string[] = Object.getOwnPropertyNames(binding.modifiers);
            const options = stringToObject(expression);

            if (modifiers.length > 0) {
                // do not use modifiers out of expression (like "medaille-olympique.f")
                // const modifier = options.modifier ? options.modifier : modifiers[1];

                expression = Vue.prototype.$i18n.translate(
                    modifiers[0],
                    [],
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
        v.directive(I_18_N, I18nDirective);
    }
};

export default I18nDirectivePlugin;
