import Vue, { PluginObject } from 'vue';
import { WindowErrorHandler } from './errors/window-error-handler';
import HttpPlugin, { HttpPluginOptions, HttpService } from './http/http';
import I18nPlugin, { I18nPluginOptions, Messages } from './i18n/i18n';
import LoggerPlugin, { ConsoleOptions, Logger } from './logger/logger';
import MediaQueriesPlugin, { MediaQueries } from './media-queries/media-queries';
import ModulPlugin, { Modul } from './modul/modul';
import ScrollToPlugin, { ScrollTo } from './scroll-to/scroll-to';
import SpritesPlugin, { SpritesService } from './svg/sprites';

declare module 'vue/types/vue' {
    interface Vue {
        $modul: Modul;
        $log: Logger;
        $i18n: Messages;
        $http: HttpService;
        $mq: MediaQueries;
        $svg: SpritesService;
        $scrollTo: ScrollTo;
    }
}
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
        Vue.use(ModulPlugin);
        Vue.use(ScrollToPlugin);
    }
};

export default UtilsPlugin;
