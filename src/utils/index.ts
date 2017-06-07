import Vue from 'vue';
import { PluginObject } from 'vue';

import MessagesPlugin from './i18n';
import HttpPlugin from './http';
import SecurityPlugin, { SecurityPluginOptions } from './security';

export interface UtilsPluginOptions {
    securityPluginOptions: SecurityPluginOptions;
}

const UtilsPlugin: PluginObject<any> = {
    install(v, options) {
        if (!options) {
            throw new Error('UtilsPlugin.install -> options cannot be null');
        }
        let o: UtilsPluginOptions = options as UtilsPluginOptions;
        Vue.use(MessagesPlugin);
        Vue.use(HttpPlugin);
        Vue.use(SecurityPlugin, o.securityPluginOptions);
    }
};

export default UtilsPlugin;
