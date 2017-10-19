import Vue, { DirectiveOptions, VNodeDirective, VNode } from 'vue';
import { PluginObject } from 'vue';
import { POPUP_NAME } from '../directive-names';
import { MPopup } from '../../components/popup/popup';

const MPopupDirective: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode) {
        if (node.context) {
            node.context.$nextTick(() => {
                if (node.context) {
                    (node.context.$refs[binding.arg] as MPopup).trigger = element;
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
