/* tslint:disable:no-console */
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { SCROLL_SPY_NAME } from '../directive-names';


const MScrollSpyDirective: DirectiveOptions = {
    inserted(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        console.log('DEDANS2');
    },
    update(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        console.log('DEDANS2');
    },
    unbind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
    }
};

const ScrollSpyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SCROLL_SPY_NAME, MScrollSpyDirective);
    }
};

export default ScrollSpyPlugin;
