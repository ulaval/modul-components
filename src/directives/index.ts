import Vue, { PluginObject } from 'vue';

import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import FileDropPlugin from './file-drop/file-drop';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(PopupPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
        Vue.use(FileDropPlugin);
    }
};

export default DirectivesPlugin;
