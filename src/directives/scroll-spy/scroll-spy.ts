/* tslint:disable:no-console */
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import ScrollSpyUtil from './scroll-spy-lib';

const observeDirective: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, _node: VNode): void {
        ScrollSpyUtil.addElementToObserve(element, binding.value);
    },
    update(element: HTMLElement, binding: VNodeDirective, _node: VNode): void {
        ScrollSpyUtil.removeElementObserved(binding.value);
        ScrollSpyUtil.addElementToObserve(element, binding.value);
    },
    unbind(_element: HTMLElement, binding: VNodeDirective, _node: VNode): void {
        ScrollSpyUtil.removeElementObserved(binding.value);
    }
};

const ScrollSpyPlugin: PluginObject<any> = {
    install(v, _options): void {
        v.directive(SCROLL_SPY_NAME, observeDirective);
    }
};

export default ScrollSpyPlugin;
