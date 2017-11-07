import Vue, { DirectiveOptions, VNodeDirective, VNode } from 'vue';
import { PluginObject } from 'vue';
import { POPUP_NAME } from '../directive-names';
import { OpenTrigger } from '../../mixins/open-trigger/open-trigger';

const MPopupDirective: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode) {
        if (node.context) {
            node.context.$nextTick(() => {
                if (node.context) {
                    (node.context.$refs[binding.arg] as OpenTrigger).triggerHook = element;
                }
            });
        }
    }
};

const PopupPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(POPUP_NAME, MPopupDirective);
    }
};

export default PopupPlugin;
