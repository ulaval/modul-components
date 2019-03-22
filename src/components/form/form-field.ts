import Vue, { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { FormField } from '../../utils/form/form-field/form-field';

const DISTANCE_FROM_TOP: number = -200;
const scrollToThisField: Function = (element: HTMLElement): void => {
    (Vue.prototype).$scrollTo.goTo(element, DISTANCE_FROM_TOP);
};

export const FormFieldDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const formField: FormField<any> = binding.value;

        el.addEventListener('focus', () => formField.initEdition(), true);
        el.addEventListener('blur', () => formField.endEdition(), true);
    },
    update(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const formField: FormField<any> = binding.value;
        const selector: string = 'input, textarea, [contenteditable=true]';
        const inputElement: Element = el.querySelectorAll(selector)[0];

        if (formField.shouldFocus) {
            if (el instanceof HTMLInputElement) {
                scrollToThisField(el);
                el.focus();
            } else {
                if (inputElement) {
                    scrollToThisField(inputElement);
                    (inputElement as HTMLInputElement).focus();
                }
            }

            formField.shouldFocus = false;
        }
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const formField: FormField<any> = binding.value;

        el.removeEventListener('focus', formField.initEdition, true);
        el.removeEventListener('blur', formField.endEdition, true);
    }
};
