import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { I18N_NAME } from '../directive-names';
import { Messages } from '../../utils/i18n/i18n';

const setAttribute = (el: HTMLElement, arg: string, expression: any) => {
    if (arg === 'placeholder' && !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
        if (el.querySelector('textarea')) {
            el.querySelector('textarea')!.setAttribute(arg, expression);
        } else if (el.querySelector('input')) {
            el.querySelector('input')!.setAttribute(arg, expression);
        }
    } else {
        el.setAttribute(arg, expression);
    }
};

const I18nDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        if (binding.arg) {
            if (vnode.componentInstance) {
                Vue.prototype.$log.warn(`i18n Directive souldn'y be used on a ${vnode.componentInstance.constructor.name} component. Please use the filter instead.`);
            }
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
            setAttribute(el, binding.arg, expression);
        }
    }
};

const I18nDirectivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(I18N_NAME, I18nDirective);
    }
};

export default I18nDirectivePlugin;
