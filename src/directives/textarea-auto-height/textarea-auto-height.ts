import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { TEXTAREA_AUTO_HEIGHT } from '../directive-names';

interface TextareaAutoHeightBinding extends VNodeDirective {
    ajustHeight: () => void;
    setDisabledUpdate: () => void;
}

const MTextareaAutoHeight: DirectiveOptions = (() => {
    let disabledUpdate: boolean = false;
    const ajustHeight: Function = (element: HTMLElement): void => {
        if (element.tagName === 'TEXTAREA') {
            let outerHeight: number = parseInt((window.getComputedStyle(element).height as string), 10);
            let diff: number = outerHeight - element.clientHeight;
            element.style.height = '0';
            element.style.height = element.scrollHeight + diff + 'px';
        }
    };
    const setDisabledUpdate: Function = (): void => {
        disabledUpdate = true;
        setTimeout(() => {
            if (disabledUpdate) {
                disabledUpdate = false;
            }
        }, 800);
    };
    return {
        bind(element: HTMLElement, binding: TextareaAutoHeightBinding, node: VNode): void {
            if (node.context && element.tagName === 'TEXTAREA') {
                node.context.$nextTick(() => {
                    if (node.context && element) {
                        binding.ajustHeight = () => {
                            ajustHeight(element);
                            setDisabledUpdate();
                        };
                        binding.setDisabledUpdate = () => {
                            setDisabledUpdate();
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
            if (!disabledUpdate) {
                ajustHeight(element);
            }
        },
        unbind(element: HTMLElement, binding: TextareaAutoHeightBinding): void {
            if (element.tagName === 'TEXTAREA') {
                if (binding.setDisabledUpdate) {
                    element.removeEventListener('mousedown', binding.setDisabledUpdate);
                }

                element.removeEventListener('input', binding.ajustHeight);
                window.removeEventListener('resize', binding.ajustHeight);
            }
        }
    };
})();

const TextareaAutoHeightPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(TEXTAREA_AUTO_HEIGHT, MTextareaAutoHeight);
    }
};

export default TextareaAutoHeightPlugin;
