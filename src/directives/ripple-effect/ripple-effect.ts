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
        RippleEffect.isActive = binding.value == undefined ? false : binding.value;
        element.style.overflow = 'hidden';
        if (element && RippleEffect.isActive) {
            binding.listener = (event: MouseEvent) => {
                RippleEffect.initRipple(event, element);
            };
            element.addEventListener('mousedown', binding.listener);
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
