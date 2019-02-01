import { FormField } from 'src/utils/form/form-field/form-field';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';

let touchFormField: any;

export const FormFieldDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const formField: FormField<any> = binding.value;
        touchFormField = () => formField.touch();

        el.addEventListener('blur', touchFormField, true);
    },
    update(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        const formField: FormField<any> = binding.value;

        if (formField.shouldFocus) {
            if (el instanceof HTMLInputElement) {
                el.focus();
            } else {
                const selector: string = 'input, textarea, [contenteditable=true]';
                const elements: NodeListOf<HTMLInputElement> = el.querySelectorAll(selector);

                if (elements.length > 0) {
                    elements[0].focus();
                }
            }

            formField.shouldFocus = false;
        }
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        el.removeEventListener('blur', touchFormField, true);
    }
};
