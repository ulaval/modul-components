import Vue, { PluginObject } from 'vue';

import MediaQueriesPlugin from './media-queries/media-queries';
import ModulPlugin from './modul/modul';
import I18nPlugin, { I18nPluginOptions } from './i18n/i18n';
import HttpPlugin, { HttpPluginOptions } from './http/http';
import SpritesPlugin from './svg/sprites';
import * as TouchPlugin from 'vue-touch';
import ConfirmPlugin from './modal/confirm';
import AlertPlugin from './modal/alert';
import FilePlugin from '../utils/file/file';
import { PortalPluginInstall } from 'portal-vue';
import LoggerPlugin, { ConsoleOptions } from './logger/logger';

export interface UtilsPluginOptions {
    httpPluginOptions?: HttpPluginOptions;
    consoleOptions?: ConsoleOptions;
    i18PluginOptions?: I18nPluginOptions;
}

const UtilsPlugin: PluginObject<any> = {
    install(v, options): void {
        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin, options ? options.consoleOptions : undefined);
        } else if (options) {
            v.prototype.$log.setConsoleOptions(options.consoleOptions);
        }

        Vue.use(MediaQueriesPlugin);
        Vue.use(ModulPlugin);
        Vue.use(I18nPlugin, options ? options.i18PluginOptions : undefined);
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
