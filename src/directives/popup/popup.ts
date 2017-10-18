import Vue, { DirectiveOptions, VNodeDirective, VNode } from 'vue';
import { PluginObject } from 'vue';
import { POPUP_NAME } from '../directive-names';

const MPopup: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode) {
        if (node.context) {
            node.context.$nextTick(() => {
                if (node.context) {
                    (node.context.$refs[binding.arg] as any).trigger = element;
                }
            });
        }
    }
};

const PopupPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(POPUP_NAME, MPopup);
    }
};

export default PopupPlugin;
