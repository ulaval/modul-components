import Vue from 'vue';
import { PluginObject } from 'vue';
import RippleEffect from './ripple-effect-lib';
import { RIPPLE_EFFECT_NAME } from '../directive-names';

export class MRippleEffect extends Vue {

    public bind(element: HTMLElement, binding) {
        let isActive: boolean = binding.value == undefined ? true : binding.value;
        let el: HTMLElement = element;
        if (el) {
            el.addEventListener('mousedown', (event: MouseEvent) => {
                RippleEffect.initRipple(event, el, isActive);
            });
        }
    }

    public unbind(element: HTMLElement) {
        if (element) {
            element.removeEventListener('mousedown', () => false, false);
        }
    }
}

const RippleEffectPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(RIPPLE_EFFECT_NAME, new MRippleEffect());
    }
};

export default RippleEffectPlugin;
