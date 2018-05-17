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

const buildCounter = (element, binding, vnode) => {
    let maxLength: number | undefined = (vnode.componentOptions as ComponentMeta)['propsData']['maxLength'];
    let valueLegth: number = vnode.componentInstance.valueLength;
    let hasErrorMessage: boolean = !!(vnode.componentOptions as ComponentMeta)['propsData']['errorMessage'];
    let hasError: boolean = !!(vnode.componentOptions as ComponentMeta)['propsData']['error'];

    // tslint:disable-next-line:no-console
    console.log(element.children[1]);

    const MyComponent = Vue.extend({
        template: `<p class="m-character-count-directive m-u--margin-top--xs m-u--font-size--xs">${valueLegth} / ${maxLength}</p>`
    });

    Vue.nextTick(() => {
        const component = new MyComponent().$mount();
        component.$el.style.textAlign = 'right';
        maxLength && valueLegth > maxLength || hasErrorMessage || hasError ? component.$el.style.color = COLOR_ERROR : component.$el.style.color = COLOR_INIT;
        if (hasErrorMessage) {
            element.children[1].appendChild(component.$el);
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

        // let displayMode: string = binding.value ? binding.value.display : MCharacterCountDisplay.Always;
        if (displayMode !== MCharacterCountDisplay.None) {
            buildCounter(element, binding, vnode);
        }
    },
    update(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        if (element.children[element.children.length - 1].classList.contains('m-character-count-directive')) {
            element.removeChild(element.children[element.children.length - 1]);
        }

        // let displayMode: string = binding.value ? binding.value.display : MCharacterCountDisplay.Always;
        if (displayMode !== MCharacterCountDisplay.None) {
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
