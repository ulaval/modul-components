import Vue from 'vue';
import { PluginObject } from 'vue';

import MediaQueriesPlugin from './media-queries/media-queries';
import ModulPlugin from './modul/modul';
import MessagesPlugin from './i18n/i18n';
import HttpPlugin from './http/http';
import PortalPlugin from 'portal-vue';
import SecurityPlugin, { SecurityPluginOptions } from './http/security';
import SpritesPlugin from './svg/sprites';
import * as TouchPlugin from 'vue-touch';
import ConfirmPlugin from './modal/confirm';

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
        Vue.use(ModulPlugin);
        Vue.use(MessagesPlugin);
        Vue.use(HttpPlugin);
        Vue.use(PortalPlugin);
        Vue.use(SecurityPlugin, o.securityPluginOptions);
        Vue.use(SpritesPlugin);
        Vue.use(TouchPlugin, { name: 'v-touch' });
        Vue.use(ConfirmPlugin);
    }
};

export default UtilsPlugin;
