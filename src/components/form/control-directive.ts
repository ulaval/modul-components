import Vue, { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { AbstractControl } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';

const DISTANCE_FROM_TOP: number = -200;

const scrollToElement: Function = (element: HTMLElement): void => {
    (Vue.prototype).$scrollTo.goTo(element, DISTANCE_FROM_TOP);
};

export const AbstractControlDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
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

        if (control instanceof FormControl) {
            Object.defineProperty(el, 'ControlDirectiveListeners', {
                value: {
                    focusListener: () => control.initEdition(),
                    blurListener: (event: any) => control.endEdition()
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

        control.focusGrantedObservable.unsubscribe();

        if (control instanceof FormControl) {
            (vnode.componentInstance as Vue).$off('focus', el['ControlDirectiveListeners'].focusListener);
            (vnode.componentInstance as Vue).$off('blur', el['ControlDirectiveListeners'].blurListener);
        }


    }
};

