import Vue from 'vue';
import { PluginObject } from 'vue';

import MediaQueriesPlugin from './media-queries/media-queries';
import MessagesPlugin from './i18n/i18n';
import HttpPlugin from './http/http';
import SecurityPlugin, { SecurityPluginOptions } from './http/security';

export interface UtilsPluginOptions {
    securityPluginOptions: SecurityPluginOptions;
}

const UtilsPlugin: PluginObject<any> = {
    install(v, options) {
        if (!options) {
            throw new Error('UtilsPlugin.install -> you must provide a UtilsPluginOptions option object.');
        }
        let o: UtilsPluginOptions = options as UtilsPluginOptions;

        Vue.use(MediaQueriesPlugin);
        Vue.use(MessagesPlugin);
        Vue.use(HttpPlugin);
        Vue.use(SecurityPlugin, o.securityPluginOptions);
    }
};

export default UtilsPlugin;
