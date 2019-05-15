import Vue, { DirectiveOptions, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';

const DISTANCE_FROM_TOP: number = -200;

const scrollToElement: Function = (element: HTMLElement): void => {
    (Vue.prototype).$scrollTo.goTo(element, DISTANCE_FROM_TOP);
};

export const AbstractControlDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const control: AbstractControl = binding.value;
        const selector: string = 'input, textarea, [contenteditable=true]';
        const inputElement: Element = el.querySelectorAll(selector)[0];

        control.focusGrantedObservable.subscribe(granted => {
            if (!granted) {
                return;
            }

            if (el instanceof HTMLInputElement) {
                scrollToElement(el);
                el.focus();
            } else if (inputElement) {
                scrollToElement(inputElement);
                (inputElement as HTMLInputElement).focus();
            } else {
                scrollToElement(el);
            }

            control.focusGrantedObservable.next(false);
        });

        Object.defineProperty(el, 'ControlDirectiveListeners', {
            value: {
                focusListener: () => {
                    if (control instanceof FormControl) {
                        control.initEdition();
                    }
                },
                blurListener: (event: any) => {
                    if (control instanceof FormControl) {
                        control.endEdition();
                    }
                }
            }
        });

        el.addEventListener('focus', el['ControlDirectiveListeners'].focusListener, true);
        el.addEventListener('blur', el['ControlDirectiveListeners'].blurListener, true);
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const control: AbstractControl = binding.value;

        control.focusGrantedObservable.unsubscribe();

        el.removeEventListener('focus', el['ControlDirectiveListeners'].focusListener, true);
        el.removeEventListener('blur', el['ControlDirectiveListeners'].blurListener, true);
    }
};

