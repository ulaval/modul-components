/* tslint:disable:no-console */
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import { SCROLL_SPY_NAME } from '../directive-names';
import ScrollSpyUtil from './scroll-spy-lib';

export class IntersectionObserverOptions {
    root: Element | null;
    rootMargin: string;
    threshold: number;
}

const observeDirective: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const root: Element = getVNodeAttributeValue(node, 'root') ? getVNodeAttributeValue(node, 'root') : undefined;
        const rootMargin: string = getVNodeAttributeValue(node, 'root-margin') ? getVNodeAttributeValue(node, 'root-margin') : '0px';
        const threshold: number = getVNodeAttributeValue(node, 'threshold') ? getVNodeAttributeValue(node, 'threshold') : 0;
        const options: IntersectionObserverOptions = {
            root: root,
            rootMargin: rootMargin,
            threshold: threshold
        };
        if (binding.value) {
            ScrollSpyUtil.addElementToObserve(element, options);
        }
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const root: Element = getVNodeAttributeValue(node, 'root') ? getVNodeAttributeValue(node, 'root') : undefined;
        const rootMargin: string = getVNodeAttributeValue(node, 'root-margin') ? getVNodeAttributeValue(node, 'root-margin') : '0px';
        const threshold: number = getVNodeAttributeValue(node, 'threshold') ? getVNodeAttributeValue(node, 'threshold') : 0;
        const options: IntersectionObserverOptions = {
            root: root,
            rootMargin: rootMargin,
            threshold: threshold
        };
        ScrollSpyUtil.removeElementObserved(element);
        if (binding.value) {
            ScrollSpyUtil.addElementToObserve(element, options);
        }
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
