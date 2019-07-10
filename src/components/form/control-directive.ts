import Vue, { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';

const INPUT_SELECTOR: string = 'input, textarea, [contenteditable=true]';

export const AbstractControlDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const control: AbstractControl = binding.value;

        if (control) {
            // We can't assign the element directly on recent Vue version.
            // https://github.com/vuejs/vue/issues/7788
            control.htmlElementAccessor = () => el.querySelector(INPUT_SELECTOR) as HTMLElement;
        }

        if (control instanceof FormControl) {
            el.addEventListener('focusin', control.initEdition);
            el.addEventListener('focusout', control.endEdition);
        }
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const control: AbstractControl = binding.value;
        const inputElement: Element | null = el.querySelector(INPUT_SELECTOR);
        if (!control || !inputElement || control.htmlElement === inputElement) {
            control.htmlElementAccessor = () => { return undefined! as HTMLElement; };
        }

        el.removeEventListener('focusin', control.initEdition);
        el.removeEventListener('focusout', control.endEdition);
    }
};
