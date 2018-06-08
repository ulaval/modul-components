import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { TEXTAREA_AUTO_HEIGHT } from '../directive-names';

interface TextareaAutoHeightBinding extends VNodeDirective {
    ajustHeight: () => void;
}

const MTextareaAutoHeight: DirectiveOptions = {
    bind(element: HTMLElement, binding: TextareaAutoHeightBinding, node: VNode): void {
        if (node.context && element.tagName === 'TEXTAREA') {
            node.context.$nextTick(() => {
                if (node.context && element) {
                    binding.ajustHeight = () => {
                        if (element) {
                            let outerHeight: number = parseInt((window.getComputedStyle(element).height as string), 10);
                            let diff: number = outerHeight - element.clientHeight;
                            element.style.height = '0';
                            element.style.height = element.scrollHeight + diff + 'px';
                        }
                    };
                    element.addEventListener('input', binding.ajustHeight);
                    window.addEventListener('resize', binding.ajustHeight);
                    setTimeout(() => {
                        binding.ajustHeight();
                    });
                }
            });
        }
    },
    unbind(element: HTMLElement, binding: TextareaAutoHeightBinding): void {
        if (element.tagName === 'TEXTAREA' && binding.ajustHeight) {
            element.removeEventListener('input', binding.ajustHeight);
            window.removeEventListener('resize', binding.ajustHeight);
        }
    }
};

const TextareaAutoHeightPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(TEXTAREA_AUTO_HEIGHT, MTextareaAutoHeight);
    }
};

export default TextareaAutoHeightPlugin;
