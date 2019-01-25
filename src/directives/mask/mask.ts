import Inputmask from 'inputmask';
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { MASK_NAME } from '../directive-names';

const MMaskDirective: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        Inputmask(binding.value).mask(element);
    }
};

const MaskPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(MASK_NAME, MMaskDirective);
    }
};

export default MaskPlugin;
