import Vue, { PluginObject } from 'vue';
import { WindowErrorHandler } from './errors/window-error-handler';
import HttpPlugin, { HttpPluginOptions } from './http/http';
import I18nPlugin, { I18nPluginOptions } from './i18n/i18n';
import LoggerPlugin, { ConsoleOptions } from './logger/logger';
import MediaQueriesPlugin from './media-queries/media-queries';
import ModulPlugin from './modul/modul';
import ScrollToPlugin from './scroll-to/scroll-to';
import SpritesPlugin from './svg/sprites';


export interface UtilsPluginOptions {
    httpPluginOptions?: HttpPluginOptions;
    consoleOptions?: ConsoleOptions;
    i18PluginOptions?: I18nPluginOptions;
    propagateVueParserErrors?: boolean;
}

const UtilsPlugin: PluginObject<any> = {
    install(v, options): void {
        if (!options || options.propagateVueParserErrors === undefined || options.propagateVueParserErrors) {
            // Vue parser errors do not propagate to window.onError by default
            Vue.config.errorHandler = (err, vm, info) => {
                WindowErrorHandler.onError(new ErrorEvent('error', { error: err }));
            };
        }

        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin, options ? options.consoleOptions : undefined);
        } else if (options) {
            v.prototype.$log.setConsoleOptions(options.consoleOptions);
        }

        Vue.use(I18nPlugin, options ? options.i18PluginOptions : undefined);
        Vue.use(HttpPlugin, options ? options.httpPluginOptions : undefined);
        Vue.use(MediaQueriesPlugin);
        Vue.use(SpritesPlugin);
        Vue.use(ModulPlugin); // portal service
        Vue.use(ScrollToPlugin);
    }
};

export default UtilsPlugin;
