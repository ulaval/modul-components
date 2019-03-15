import Vue, { PluginObject } from 'vue';
import LoggerPlugin from '../utils/logger/logger';
import DateFilterPlugin from './date/date';
import MoneyPlugin from './date/money/money';
import I18nFilterPlugin from './i18n/i18n';

const FiltersPlugin: PluginObject<any> = {
    install(v, options): void {

        v.prototype.$log.error('FiltersPlugin will be deprecated in modul v.1.0, filter should now be installed separately');

        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin);
        }

        Vue.use(DateFilterPlugin);
        Vue.use(MoneyPlugin);
        Vue.use(I18nFilterPlugin);
    }
};

export default FiltersPlugin;
