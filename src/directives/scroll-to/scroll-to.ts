import { PluginObject, DirectiveOptions, VNodeDirective } from 'vue';
import ScrollTo, { ScrollToDuration } from './scroll-to-lib';
import { SCROLL_TO_NAME } from '../directive-names';

const MOUSE_DOWN_MODIFIER: string = 'ripple-effect_mouse-down';

interface ScrollToBinding extends VNodeDirective {
    listener: (event: MouseEvent) => void;
}

const MScrollTo: DirectiveOptions = {
    bind(element: HTMLElement, binding: ScrollToBinding) {
        if (element) {
            binding.listener = (event: MouseEvent) => {
                let scrollEl: HTMLElement = binding.value[3] == undefined || binding.value[3].length <= 2 ? document.body : document.querySelector(binding.value[3]);
                let target: HTMLElement = document.querySelector((binding.value[0] == undefined || binding.value[0].length >= 2 ? binding.value[0] : 'body')) as HTMLElement;
                let targetPosition: number = target ? target.offsetTop : 0;
                let duration: string;
                switch (binding.value[1]) {
                    case ScrollToDuration.Null:
                    case ScrollToDuration.Slow:
                    case ScrollToDuration.Fast:
                        duration = binding.value[1];
                        break;
                    default:
                        duration = ScrollToDuration.Regular;
                }
                ScrollTo.startScroll(scrollEl, targetPosition, duration);
            };
            element.addEventListener('touchstart', binding.listener);
            element.addEventListener('click', binding.listener);
        }
    },
    unbind(element: HTMLElement, binding: ScrollToBinding) {
        if (element && binding.listener) {
            element.removeEventListener('touchstart', binding.listener);
            element.removeEventListener('click', binding.listener);
        }
    }
};

const ScrollToPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(SCROLL_TO_NAME, MScrollTo);
    }
};

export default ScrollToPlugin;
