import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { ComponentMeta } from '../../meta/meta';
import { CHARACTER_COUNT_NAME } from './../directive-names';

export enum MCharacterCountDisplay {
    Always = 'always',
    FromThreshold = 'from-threshold',
    None = 'none'
}

const COLOR_ERROR: string = '#e30513';
const COLOR_INIT: string = 'inherit';

const displayMode: (binding: VNodeDirective) => MCharacterCountDisplay = (binding: VNodeDirective) => {
    return binding.value ? binding.value.display : MCharacterCountDisplay.Always;
};

const hasErrorMessage: (vnode: VNode) => Boolean = (vnode: VNode) => {
    return !!(vnode.componentOptions as ComponentMeta)['propsData']['errorMessage'];
};

const hasError: (vnode: VNode) => Boolean = (vnode: VNode) => {
    return !!(vnode.componentOptions as ComponentMeta)['propsData']['error'];
};

const buildCounter = (element, binding, vnode) => {
    let maxLength: number | undefined = (vnode.componentOptions as ComponentMeta)['propsData']['maxLength'];
    let valueLength: number = vnode.componentInstance.valueLength;

    const MyComponent = Vue.extend({
        template: `<div class="m-character-count-directive m-u--margin-top--xs m-u--font-size--xs" aria-hidden="true">${valueLength}/${maxLength}</div>`
    });

    Vue.nextTick(() => {
        const component = new MyComponent().$mount();
        component.$el.style.textAlign = 'right';
        component.$el.style.paddingLeft = '4px';
        maxLength && valueLength > maxLength || hasErrorMessage(vnode) || hasError(vnode) ? component.$el.style.color = COLOR_ERROR : component.$el.style.color = COLOR_INIT;
        if (hasErrorMessage(vnode)) {
            element.children[element.children.length - 1].appendChild(component.$el);
        } else {
            element.appendChild(component.$el);
        }
    });
};

const MCharacterCountDirective: DirectiveOptions = {
    bind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        if (displayMode(binding) !== MCharacterCountDisplay.None) {
            buildCounter(element, binding, vnode);
        }
    },
    update(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        let elementValidation: Element | undefined = element.children[element.children.length - 1].classList.contains('m-textfield__validation') ? element.children[element.children.length - 1] : undefined ;
        if (element.children[element.children.length - 1].classList.contains('m-character-count-directive') && !hasErrorMessage(vnode)) {
            element.removeChild(element.children[element.children.length - 1]);
        } else if (elementValidation && hasErrorMessage(vnode)) {
            elementValidation.removeChild(elementValidation.children[1]);
        }

        if (displayMode(binding) !== MCharacterCountDisplay.None) {
            buildCounter(element, binding, vnode);
        }
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
