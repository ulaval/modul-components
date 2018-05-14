import { PortalPluginInstall } from 'portal-vue';
import Vue, { PluginObject } from 'vue';
import * as TouchPlugin from 'vue-touch';

import RadioSandboxPlugin from '../components/radio/radio-sandbox';
import FilePlugin from '../utils/file/file';
import HttpPlugin, { HttpPluginOptions } from './http/http';
import I18nPlugin, { I18nPluginOptions } from './i18n/i18n';
import LoggerPlugin, { ConsoleOptions } from './logger/logger';
import MediaQueriesPlugin from './media-queries/media-queries';
import AlertPlugin from './modal/alert';
import ConfirmPlugin from './modal/confirm';
import ModulPlugin from './modul/modul';
import SpritesPlugin from './svg/sprites';

export interface UtilsPluginOptions {
    httpPluginOptions?: HttpPluginOptions;
    consoleOptions?: ConsoleOptions;
    i18PluginOptions?: I18nPluginOptions;
}

export const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(RadioSandboxPlugin);
    }
};

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
