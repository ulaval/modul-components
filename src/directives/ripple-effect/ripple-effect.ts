import { DirectiveOptions, PluginObject } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { RIPPLE_EFFECT_NAME } from '../directive-names';
import RippleEffect from './ripple-effect-lib';


const MOUSE_DOWN_MODIFIER: string = 'ripple-effect_mouse-down';

interface RippleEffectBinding extends DirectiveBinding {
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
        v.prototype.$log.error('RippleEffectBinding will be deprecated in modul v.1.0');

        v.directive(RIPPLE_EFFECT_NAME, MRippleEffect);
    }
};

export default RippleEffectPlugin;
