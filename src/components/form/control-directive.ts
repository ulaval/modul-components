import Vue, { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';

const INPUT_SELECTOR: string = 'input, textarea, [contenteditable=true]';

export const AbstractControlDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const control: AbstractControl = binding.value;
        const inputElements: NodeListOf<HTMLElement> = el.querySelectorAll(INPUT_SELECTOR);

        if (inputElements.length > 0) {
            control.htmlElement = inputElements[0];
        } else {
            control.htmlElement = el;
        }

        if (control instanceof FormControl) {
            Object.defineProperty(el, 'ControlDirectiveListeners', {
                value: {
                    focusListener: () => control.initEdition(),
                    blurListener: () => control.endEdition()
                }
            });
            (vnode.componentInstance as Vue).$on('focus', el['ControlDirectiveListeners'].focusListener);
            (vnode.componentInstance as Vue).$on('blur', el['ControlDirectiveListeners'].blurListener);
        }
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const control: AbstractControl = binding.value;

        control.htmlElement = undefined;

        if (control instanceof FormControl) {
            (vnode.componentInstance as Vue).$off('focus', el['ControlDirectiveListeners'].focusListener);
            (vnode.componentInstance as Vue).$off('blur', el['ControlDirectiveListeners'].blurListener);
        }
    }
};
