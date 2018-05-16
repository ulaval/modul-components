import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { CHARACTER_COUNT_NAME } from './../directive-names';

const MCharacterCountDirective: DirectiveOptions = {
    bind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        element.style.paddingTop = '20px';
    },
    update(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        //
    },
    unbind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        //
    }
};

const CharacterCountPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(CHARACTER_COUNT_NAME, MCharacterCountDirective);
    }
};

export default CharacterCountPlugin;
