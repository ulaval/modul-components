import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { FormField } from '../../utils/form/form-field/form-field';
import { ScrollTo } from '../../utils/scroll-to/scroll-to';

let touchFormField: any;
const DISTANCE_FROM_TOP: number = -200;

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
            let scrollTo: ScrollTo = new ScrollTo();
            if (el instanceof HTMLInputElement) {
                scrollTo.goTo(el, DISTANCE_FROM_TOP);
                el.focus();
            } else {
                const selector: string = 'input, textarea, [contenteditable=true]';
                const elements: NodeListOf<HTMLInputElement> = el.querySelectorAll(selector);

                if (elements.length > 0) {
                    scrollTo.goTo(elements[0], DISTANCE_FROM_TOP);
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
