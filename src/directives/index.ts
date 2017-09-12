import Vue from 'vue';
import { PluginObject } from 'vue';

import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
    }
};

export default DirectivesPlugin;
