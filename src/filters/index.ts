import I18nFilterPlugin from './i18n/i18n';
import Vue, { PluginObject } from 'vue';
import LoggerPlugin from '../utils/logger/logger';

const FiltersPlugin: PluginObject<any> = {
    install(v, options): void {

        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin);
        }

        Vue.use(I18nFilterPlugin);
    }
};

export default FiltersPlugin;
