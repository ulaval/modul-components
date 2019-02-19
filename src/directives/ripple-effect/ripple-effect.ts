import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { RIPPLE_EFFECT_NAME } from '../directive-names';
import RippleEffect from './ripple-effect-lib';


const MOUSE_DOWN_MODIFIER: string = 'ripple-effect_mouse-down';

interface RippleEffectBinding extends VNodeDirective {
    listener: (event: MouseEvent) => void;
}

const MRippleEffect: DirectiveOptions = {
    bind(el: HTMLElement,
        binding: DirectiveBinding,
        vnode: VNode,
        oldVnode: VNode): void {
        RippleEffect.isActive = binding.value === undefined ? false : binding.value;
        el.style.overflow = 'hidden';
        if (el) {
            (binding as RippleEffectBinding).listener = (event: MouseEvent) => {
                RippleEffect.initRipple(event, el);
            };
            el.addEventListener('mousedown', (binding as RippleEffectBinding).listener);
        }
    },
    componentUpdated(el: HTMLElement,
        binding: DirectiveBinding,
        vnode: VNode,
        oldVnode: VNode): void {
        RippleEffect.isActive = binding.value === undefined ? false : binding.value;
    },
    unbind(el: HTMLElement,
        binding: DirectiveBinding,
        vnode: VNode,
        oldVnode: VNode): void {
        if (el && (binding as RippleEffectBinding).listener) {
            el.removeEventListener('mousedown', (binding as RippleEffectBinding).listener);
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
