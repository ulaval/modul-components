import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { ScrollTo, ScrollToEasing, ScrollToSpeed } from '../../utils';
import { SCROLL_TO_NAME } from '../directive-names';

class ScrollToCallback {

    constructor(private speed: ScrollToSpeed, private easing: ScrollToEasing, private offset: number, private target: HTMLElement) { }

    callBack: (event: MouseEvent) => void = (event: MouseEvent) => {
        // tslint:disable-next-line:no-console
        console.log('run' + JSON.stringify({ speed: this.speed, easing: this.easing, offset: this.offset }));
        let scrollTo: ScrollTo = (Vue.prototype as any).$scrollTo as ScrollTo;

        scrollTo.goTo(this.target, this.offset, this.speed, this.easing);
    }
}

/**
 *
 */
const MScrollTo: DirectiveOptions = {

    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        let speed: ScrollToSpeed = binding.value.speed || ScrollToSpeed.Regular;

        let easing: ScrollToEasing = binding.value.easing || ScrollToEasing.Linear;

        let offset: number = binding.value.offset || 0;

        if (!node.context) {
            throw new Error('Error node context is null');
        }
        let target: HTMLElement = node.context.$refs[binding.arg] as HTMLElement;
        const _scrollToCallback: ScrollToCallback = new ScrollToCallback(speed, easing, offset, target);

        Object.defineProperty(element, '_scrollToCallback', {
            value: _scrollToCallback
        });

        element.addEventListener('touchstart', _scrollToCallback.callBack);
        element.addEventListener('click', _scrollToCallback.callBack);
    },
    update(element: HTMLElement, binding: VNodeDirective): void {
        if (element && (element as any)._scrollToCallback) {
            (element as any)._scrollToCallback.speed = binding.value.speed || ScrollToSpeed.Regular;

            (element as any)._scrollToCallback.easing = binding.value.easing || ScrollToEasing.Linear;

            (element as any)._scrollToCallback.offset = binding.value.offset || 0;
        }
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        if (element && (element as any)._scrollToCallback) {
            element.removeEventListener('touchstart', (element as any)._scrollToCallback.callBack);
            element.removeEventListener('click', (element as any)._scrollToCallback.callBack);
        }
    }
};

const ScrollToPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SCROLL_TO_NAME, MScrollTo);
    }
};

export default ScrollToPlugin;
