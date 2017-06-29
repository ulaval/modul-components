import Vue from 'vue';
import { PluginObject } from 'vue';

import RippleEffectPlugin from './ripple-effect/ripple-effect';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(RippleEffectPlugin);
    }
};

export default DirectivesPlugin;
