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

        const inputElements: NodeListOf<Element> = el.querySelectorAll(INPUT_SELECTOR);
        if (inputElements.length > 0) {
            control.focusableElement = inputElements[0] as HTMLElement;
        } else {
            control.focusableElement = el;
        }

        if (control instanceof FormControl) {
            Object.defineProperty(el, 'ControlDirectiveListeners', {
                value: {
                    focusListener: () => control.initEdition(),
                    blurListener: (event: any) => control.endEdition()
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

        control.focusableElement = undefined;

        if (control instanceof FormControl) {
            (vnode.componentInstance as Vue).$off('focus', el['ControlDirectiveListeners'].focusListener);
            (vnode.componentInstance as Vue).$off('blur', el['ControlDirectiveListeners'].blurListener);
        }


    }
};
