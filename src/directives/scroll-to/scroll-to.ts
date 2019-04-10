import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { ScrollTo, ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_TO_NAME } from '../directive-names';


class ScrollToCallback {

    constructor(private speed: ScrollToDuration, private offset: number, private target: HTMLElement) { }

    callBack: (event: MouseEvent) => void = (event: MouseEvent) => {
        let scrollTo: ScrollTo = (Vue.prototype as ModulVue).$scrollTo;

        scrollTo.goTo(this.target, this.offset, this.speed);
    }
}

const MScrollTo: DirectiveOptions = {

    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        let speed: ScrollToDuration = binding.value.speed || ScrollToDuration.Regular;

        let offset: number = binding.value.offset || 0;

        if (!node.context) {
            throw new Error('Error node context is null');
        }
        let target: HTMLElement = node.context.$refs[binding.arg!] as HTMLElement;
        const _scrollToCallback: ScrollToCallback = new ScrollToCallback(speed, offset, target);

        Object.defineProperty(element, '_scrollToCallback', {
            value: _scrollToCallback
        });

        element.addEventListener('touchstart', _scrollToCallback.callBack);
        element.addEventListener('click', _scrollToCallback.callBack);
    },
    update(element: HTMLElement, binding: VNodeDirective): void {
        if (element && (element as any)._scrollToCallback) {
            (element as any)._scrollToCallback.speed = binding.value.speed || ScrollToDuration.Regular;

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
        v.prototype.$log.error('ScrollToDirective will be deprecated in modul v.1.0');

        v.use(ScrollToPlugin);
        v.directive(SCROLL_TO_NAME, MScrollTo);
    }
};

export default ScrollToPlugin;
