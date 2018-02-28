import { PluginObject, DirectiveOptions, VNodeDirective, VNode } from 'vue';
import ScrollTo, { ScrollToDuration } from './scroll-to-lib';
import { SCROLL_TO_NAME } from '../directive-names';
import { log } from 'util';

const MOUSE_DOWN_MODIFIER: string = 'ripple-effect_mouse-down';

interface ScrollToBinding extends VNodeDirective {
    listener: (event: MouseEvent) => void;
}

const MScrollTo: DirectiveOptions = {
    bind(element: HTMLElement, binding: ScrollToBinding, node: VNode): void {
        if (node.context) {
            node.context.$nextTick(() => {
                if (node.context && element) {
                    binding.listener = (event: MouseEvent) => {
                        let target: HTMLElement = node.context != undefined && node.context.$refs[binding.arg] ? node.context.$refs[binding.arg] as HTMLElement : document.body;
                        let duration: string;
                        switch (binding.value) {
                            case ScrollToDuration.Null:
                            case ScrollToDuration.Slow:
                            case ScrollToDuration.Fast:
                                duration = binding.value;
                                break;
                            default:
                                duration = ScrollToDuration.Regular;
                        }
                        ScrollTo.startScroll(element, target.offsetTop, duration);
                    };
                    element.addEventListener('touchstart', binding.listener);
                    element.addEventListener('click', binding.listener);
                }
            });
        }
    },
    unbind(element: HTMLElement, binding: ScrollToBinding): void {
        if (element && binding.listener) {
            element.removeEventListener('touchstart', binding.listener);
            element.removeEventListener('click', binding.listener);
        }
    }
};

const ScrollToPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SCROLL_TO_NAME, MScrollTo);
    }
};

export default ScrollToPlugin;
