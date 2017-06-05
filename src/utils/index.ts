import Vue from 'vue';
import { PluginObject } from 'vue';

import MessagesPlugin from './i18n';
import HttpPlugin from './http';

const UtilsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(MessagesPlugin);
        Vue.use(HttpPlugin);
    }
};

export default UtilsPlugin;
