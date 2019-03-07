/* tslint:disable:no-console */
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import ScrollSpyUtil from './scroll-spy-lib';

const observeDirective: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, _node: VNode): void {
        if (binding.value) {
            ScrollSpyUtil.addElementToObserve(element);
        }
    },
    update(element: HTMLElement, _binding: VNodeDirective, _node: VNode): void {
        ScrollSpyUtil.removeElementObserved(element);
        ScrollSpyUtil.addElementToObserve(element);
    },
    unbind(element: HTMLElement, _binding: VNodeDirective, _node: VNode): void {
        ScrollSpyUtil.removeElementObserved(element);
    }
};

const ScrollSpyPlugin: PluginObject<any> = {
    install(v, _options): void {
        v.directive(SCROLL_SPY_NAME, observeDirective);
    }
};

export default ScrollSpyPlugin;
