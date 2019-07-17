import Vue, { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';

const INPUT_SELECTOR: string = 'input, textarea, [contenteditable=true]';

export const AbstractControlDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const control: AbstractControl = binding.value;

        // We can't assign the element directly on recent Vue version.
        // https://github.com/vuejs/vue/issues/7788
        control.htmlElementAccessor = () => el.querySelector(INPUT_SELECTOR) as HTMLElement;

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
        control.htmlElementAccessor = () => { return undefined! as HTMLElement; };
        if (control instanceof FormControl) {
            (vnode.componentInstance as Vue).$off('focus', el['ControlDirectiveListeners'].focusListener);
            (vnode.componentInstance as Vue).$off('blur', el['ControlDirectiveListeners'].blurListener);
        }
    }
};
