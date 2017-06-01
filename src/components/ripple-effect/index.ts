import { PluginObject } from 'vue';
import { MRippleEffect } from './ripple-effect';
import { RIPPLE_EFFECT } from '../component-names';

export class Directives implements PluginObject<any> {
    public install(v, options) {
        v.directive(RIPPLE_EFFECT, new MRippleEffect());
    }
}

export default new Directives();
