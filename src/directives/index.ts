import Vue, { PluginObject } from 'vue';

import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(PopupPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
    }
};

export default DirectivesPlugin;
