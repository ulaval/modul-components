import Vue, { DirectiveOptions, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';

const DISTANCE_FROM_TOP: number = -200;
const scrollToElement: Function = (element: HTMLElement): void => {
    (Vue.prototype).$scrollTo.goTo(element, DISTANCE_FROM_TOP);
};

export const AbstractControlDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const AbstractControl: AbstractControl = binding.value;

        Object.defineProperty(el, 'AbstractControlDirectiveListeners', {
            value: {
                focusListener: () => AbstractControl.initEdition(),
                blurListener: () => AbstractControl.endEdition()
            }
        });

        el.addEventListener('focus', el['AbstractControlDirectiveListeners'].focusListener, true);
        el.addEventListener('blur', el['AbstractControlDirectiveListeners'].blurListener, true);
    },
    update(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const AbstractControl: AbstractControl = binding.value;
        const selector: string = 'input, textarea, [contenteditable=true]';
        const inputElement: Element = el.querySelectorAll(selector)[0];

        if (AbstractControl.focusGranted) {
            if (el instanceof HTMLInputElement) {
                scrollToElement(el);
                el.focus();
            } else if (inputElement) {
                scrollToElement(inputElement);
                (inputElement as HTMLInputElement).focus();
            }

            AbstractControl.focusGranted = false;
        }
    },
    unbind(
        el: HTMLElement
    ): void {
        el.removeEventListener('focus', el['AbstractControlDirectiveListeners'].focusListener, true);
        el.removeEventListener('blur', el['AbstractControlDirectiveListeners'].blurListener, true);
    }
}

