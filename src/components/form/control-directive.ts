import Vue, { DirectiveOptions, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { ControlEditionContext } from '../../utils/form/control-edition-context';
import { FormGroup } from '../../utils/form/form-group';

const DISTANCE_FROM_TOP: number = -200;
const INPUT_GROUP_FOCUS_TIME_MILLISECONDS: number = 500;
const INPUT_GROUP_VALIDATION_TIME_MILLISECONDS: number = 100;

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
                focusListener: () => control.initEdition(),
                blurListener: (event: any) => {
                    if (event.srcElement instanceof HTMLButtonElement || control.focusGrantedObservable.value) {
                        return;
                    }

                    if (
                        (
                            control instanceof FormGroup
                            &&
                            (control['_editionContext'] !== ControlEditionContext.None)
                        )
                        ||
                        !(control instanceof FormGroup)
                    ) {
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
}

