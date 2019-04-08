import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { OpenTrigger } from '../../mixins/open-trigger/open-trigger';
import { POPUP_NAME } from '../directive-names';

const MPopupDirective: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        if (node.context) {
            node.context.$nextTick(() => {
                if (node.context) {
                    (node.context.$refs[binding.arg!] as OpenTrigger).triggerHook = element;
                }
            });
        }
    }
};

const PopupDirectivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(POPUP_NAME, MPopupDirective);
    }
};

export default PopupDirectivePlugin;
