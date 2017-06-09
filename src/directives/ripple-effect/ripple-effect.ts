import Vue, { DirectiveOptions, VNodeDirective } from 'vue';
import { PluginObject } from 'vue';
import RippleEffect from './ripple-effect-lib';
import { RIPPLE_EFFECT_NAME } from '../directive-names';

const MOUSE_DOWN_MODIFIER: string = 'ripple-effect_mouse-down';

interface RippleEffectBinding extends VNodeDirective {
    listener: (event: MouseEvent) => void;
}

const MRippleEffect: DirectiveOptions = {
    bind(element: HTMLElement, binding: RippleEffectBinding) {
        let isActive: boolean = binding.value == undefined ? true : binding.value;
        let el: HTMLElement = element;
        if (el) {
            binding.listener = (event: MouseEvent) => {
                RippleEffect.initRipple(event, el, isActive);
            };
            el.addEventListener('mousedown', binding.listener);
        }
    },

    unbind(element: HTMLElement, binding: RippleEffectBinding) {
        if (element && binding.listener) {
            element.removeEventListener('mousedown', binding.listener);
        }
    }
};

const RippleEffectPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(RIPPLE_EFFECT_NAME, MRippleEffect);
    }
};

export default RippleEffectPlugin;
