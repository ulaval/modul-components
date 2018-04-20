import Vue, { PluginObject } from 'vue';

import MediaQueriesPlugin from './media-queries/media-queries';
import ModulPlugin from './modul/modul';
import MessagesPlugin from './i18n/i18n';
import HttpPlugin, { HttpPluginOptions } from './http/http';
import SpritesPlugin from './svg/sprites';
import * as TouchPlugin from 'vue-touch';
import ConfirmPlugin from './modal/confirm';
import AlertPlugin from './modal/alert';
import FilePlugin from '../utils/file/file';
import { PortalPluginInstall } from 'portal-vue';

export interface UtilsPluginOptions {
    httpPluginOptions?: HttpPluginOptions;
}

const UtilsPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(MediaQueriesPlugin);
        Vue.use(ModulPlugin);
        Vue.use(MessagesPlugin);
        Vue.use(HttpPlugin, options ? options.httpPluginOptions : undefined);
        Vue.use({ install: PortalPluginInstall });
        Vue.use(SpritesPlugin);
        Vue.use(TouchPlugin, { name: 'v-touch' });
        Vue.use(ConfirmPlugin);
        Vue.use(AlertPlugin);
        Vue.use(FilePlugin);
    }
};

export default UtilsPlugin;
