import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { TEXTAREA_AUTO_HEIGHT_NAME } from '../directive-names';

interface HTMLTextAreaElementExt extends HTMLTextAreaElement {
    mTextAreaAutoSizeData: MTextAreaAutoSizeData;
}

interface MTextAreaAutoSizeData {
    lastValue: string;
    cleanup: () => void;
}

const resizeHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    if (el.scrollHeight != 0) {
        el.style.height = el.scrollHeight + 'px';
    }
};

const MTextAreaAutoSizeDirective: DirectiveOptions = {
    bind(
        el: HTMLTextAreaElementExt,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        const windowResize = () => {
            resizeHeight(el);
        };

        el.style.outline = 'none';
        el.style.resize = 'none';
        el.style.overflow = 'hidden';

        if (vnode.context) {
            vnode.context.$on('resize', windowResize);
        }

        el.mTextAreaAutoSizeData = {
            lastValue: '',
            cleanup() {
                if (vnode.context) {
                    vnode.context.$off('resize', windowResize);
                }
            }
        };
    },
    unbind(
        el: HTMLTextAreaElementExt,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        el.mTextAreaAutoSizeData.cleanup();
    },
    componentUpdated(
        el: HTMLTextAreaElementExt,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        if (el.value != el.mTextAreaAutoSizeData.lastValue) {
            el.mTextAreaAutoSizeData.lastValue = el.value;
            resizeHeight(el);
        }
    }
};

const TextAreaAutoHeightPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(TEXTAREA_AUTO_HEIGHT_NAME, MTextAreaAutoSizeDirective);
    }
};

export default TextAreaAutoHeightPlugin;
