import Vue from 'vue';
import { PluginObject } from 'vue';

import BackgroundColor from './background-color/background-color';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(BackgroundColor);
    }
};

export default DirectivesPlugin;
