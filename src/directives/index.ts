import Vue from 'vue';
import { PluginObject } from 'vue';

import BackgroundColor from './background-color/background-color';
import RippleEffectPlugin from './ripple-effect/ripple-effect';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(BackgroundColor);
        Vue.use(RippleEffectPlugin);
    }
};

export default DirectivesPlugin;
