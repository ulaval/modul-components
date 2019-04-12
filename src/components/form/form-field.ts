import Vue, { DirectiveOptions, VNodeDirective } from 'vue';
import { FormField } from '../../utils/form/form-field/form-field';

const DISTANCE_FROM_TOP: number = -200;
const scrollToThisField: Function = (element: HTMLElement): void => {
    (Vue.prototype).$scrollTo.goTo(element, DISTANCE_FROM_TOP);
};

export const FormFieldDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const formField: FormField<any> = binding.value;

        Object.defineProperty(el, 'formFieldDirectiveListeners', {
            value: {
                focusListener: () => formField.initEdition(),
                blurListener: () => {
                    formField.endEdition();
                    formField.touch();
                }
            }
        });

        el.addEventListener('focus', el['formFieldDirectiveListeners'].focusListener, true);
        el.addEventListener('blur', el['formFieldDirectiveListeners'].blurListener, true);
    },
    update(
        el: HTMLElement,
        binding: VNodeDirective
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
        el: HTMLElement
    ): void {
        el.removeEventListener('focus', el['formFieldDirectiveListeners'].focusListener, true);
        el.removeEventListener('blur', el['formFieldDirectiveListeners'].blurListener, true);
    }
};
