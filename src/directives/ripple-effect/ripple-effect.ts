import { DirectiveOptions, PluginObject, VNodeDirective } from 'vue';

import { RIPPLE_EFFECT_NAME } from '../directive-names';
import RippleEffect from './ripple-effect-lib';

const MOUSE_DOWN_MODIFIER: string = 'ripple-effect_mouse-down';

interface RippleEffectBinding extends VNodeDirective {
    listener: (event: MouseEvent) => void;
}

const MRippleEffect: DirectiveOptions = {
    bind(element: HTMLElement, binding: RippleEffectBinding): void {
        RippleEffect.isActive = binding.value === undefined ? false : binding.value;
        element.style.overflow = 'hidden';
        if (element) {
            binding.listener = (event: MouseEvent) => {
                RippleEffect.initRipple(event, element);
            };
            element.addEventListener('mousedown', binding.listener);
        }
    },
    componentUpdated(element: HTMLElement, binding: RippleEffectBinding): void {
        RippleEffect.isActive = binding.value === undefined ? false : binding.value;
    },
    unbind(element: HTMLElement, binding: RippleEffectBinding): void {
        if (element && binding.listener) {
            element.removeEventListener('mousedown', binding.listener);
        }
    }
};

const RippleEffectPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(RIPPLE_EFFECT_NAME, MRippleEffect);
    }
};

export default RippleEffectPlugin;
