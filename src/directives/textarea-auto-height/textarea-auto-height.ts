import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { TEXTAREA_AUTO_HEIGHT } from '../directive-names';

interface TextareaAutoHeightBinding extends VNodeDirective {
    ajustHeight: () => void;
    setDisabledUpdate: () => void;
}

let textareaAutoHeightDisabledUpdate: boolean = false;

function textareaAutoHeightAjustHeight(element: HTMLElement): void {
    if (element && element.tagName === 'TEXTAREA') {
        let outerHeight: number = parseInt((window.getComputedStyle(element).height as string), 10);
        let diff: number = outerHeight - element.clientHeight;
        element.style.height = '0';
        element.style.height = element.scrollHeight + diff + 'px';
    }
}

function textareaAutoHeightSetDisabledUpdate(): void {
    textareaAutoHeightDisabledUpdate = true;
    setTimeout(() => {
        if (textareaAutoHeightDisabledUpdate) {
            textareaAutoHeightDisabledUpdate = false;
        }
    }, 800);
}

const MTextareaAutoHeight: DirectiveOptions = {
    bind(element: HTMLElement, binding: TextareaAutoHeightBinding, node: VNode): void {
        if (node.context && element.tagName === 'TEXTAREA') {
            node.context.$nextTick(() => {
                if (node.context && element) {
                    binding.ajustHeight = () => {
                        textareaAutoHeightAjustHeight(element);
                        textareaAutoHeightSetDisabledUpdate();
                    };
                    binding.setDisabledUpdate = () => {
                        textareaAutoHeightSetDisabledUpdate();
                    };

                    element.addEventListener('mousedown', binding.setDisabledUpdate);
                    element.addEventListener('input', binding.ajustHeight);
                    window.addEventListener('resize', binding.ajustHeight);
                    setTimeout(() => {
                        binding.ajustHeight();
                    });
                }
            });
        }
    },
    update(element: HTMLElement): void {
        if (!textareaAutoHeightDisabledUpdate) {
            textareaAutoHeightAjustHeight(element);
        }
    },
    unbind(element: HTMLElement, binding: TextareaAutoHeightBinding): void {
        if (element.tagName === 'TEXTAREA') {
            if (binding.setDisabledUpdate) {
                element.removeEventListener('mousedown', binding.setDisabledUpdate);
            }
            if (binding.ajustHeight) {
                element.removeEventListener('input', binding.ajustHeight);
                window.removeEventListener('resize', binding.ajustHeight);
            }
        }
    }
};

const TextareaAutoHeightPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(TEXTAREA_AUTO_HEIGHT, MTextareaAutoHeight);
    }
};

export default TextareaAutoHeightPlugin;
