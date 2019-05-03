import Vue, { DirectiveOptions, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { ControlEditionContext } from '../../utils/form/control-edition-context';
import { FormGroup } from '../../utils/form/form-group';
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
            }


            control.focusGrantedObservable.next(false);
        });

        let formGroupTimeout: any;

        Object.defineProperty(el, 'AbstractControlDirectiveListeners', {
            value: {
                focusListener: (event: any) => {
                    control.initEdition();

                    if (!(control instanceof FormGroup)) {
                        return;
                    }

                    clearTimeout(formGroupTimeout);
                },
                blurListener: (event: any) => {
                    if (event.srcElement instanceof HTMLButtonElement) {
                        return;
                    }

                    if (control.focusGrantedObservable.value) {
                        return;
                    }

                    if (
                        control instanceof FormGroup
                        &&
                        control['_editionContext'] !== ControlEditionContext.None
                    ) {
                        formGroupTimeout = setTimeout(() => {
                            control.endEdition();
                        }, 500);
                    } else {
                        control.endEdition();
                    }
                }
            }
        });

        el.addEventListener('focus', el['AbstractControlDirectiveListeners'].focusListener, true);
        el.addEventListener('blur', el['AbstractControlDirectiveListeners'].blurListener, true);
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective
    ): void {
        const control: AbstractControl = binding.value;

        control.focusGrantedObservable.unsubscribe();

        el.removeEventListener('focus', el['AbstractControlDirectiveListeners'].focusListener, true);
        el.removeEventListener('blur', el['AbstractControlDirectiveListeners'].blurListener, true);
    }
}

