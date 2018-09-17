import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { TEXTAREA_AUTO_HEIGHT } from '../directive-names';

interface TextareaAutoHeightElement extends HTMLElement {
    disabledUpdate: boolean;
    ajustHeight: () => void;
    setDisabledUpdate: () => void;
}

const ajustHeight: Function = (element: HTMLElement): void => {
    if (element.tagName === 'TEXTAREA') {
        let outerHeight: number = parseInt((window.getComputedStyle(element).height as string), 10);
        let diff: number = outerHeight - element.clientHeight;
        element.style.height = '0';
        if (element.scrollHeight + diff > 0) {
            element.style.height = element.scrollHeight + diff + 'px';
        } else {
            element.style.removeProperty('height');
        }
    }
};

const MTextareaAutoHeight: DirectiveOptions = {
    bind(element: TextareaAutoHeightElement, binding: VNodeDirective, node: VNode): void {
        element.disabledUpdate = false;

        const setDisabledUpdate: Function = (): void => {
            element.disabledUpdate = true;
            setTimeout(() => {
                if (element.disabledUpdate) {
                    element.disabledUpdate = false;
                }
            }, 800);
        };

        if (node.context && element.tagName === 'TEXTAREA') {
            node.context.$nextTick(() => {
                if (node.context && element) {
                    element.ajustHeight = () => {
                        ajustHeight(element);
                        setDisabledUpdate();
                    };
                    element.setDisabledUpdate = () => {
                        setDisabledUpdate();
                    };

                    element.addEventListener('mousedown', element.setDisabledUpdate);
                    element.addEventListener('input', element.ajustHeight);
                    window.addEventListener('resize', element.ajustHeight);
                    setTimeout(() => {
                        element.ajustHeight();
                    });
                }
            });
        }
    },
    update(element: TextareaAutoHeightElement): void {
        if (!element.disabledUpdate) {
            ajustHeight(element);
        }
    },
    unbind(element: TextareaAutoHeightElement, binding: VNodeDirective): void {
        if (element.tagName === 'TEXTAREA') {
            if (element.setDisabledUpdate) {
                element.removeEventListener('mousedown', element.setDisabledUpdate);
            }

            element.removeEventListener('input', element.ajustHeight);
            window.removeEventListener('resize', element.ajustHeight);
        }
    }
};

const TextareaAutoHeightPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(TEXTAREA_AUTO_HEIGHT, MTextareaAutoHeight);
    }
};

export default TextareaAutoHeightPlugin;
