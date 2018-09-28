import Vue, { PluginObject } from 'vue';

import LoggerPlugin from '../utils/logger/logger';
import DateTimeFilterPlugin from './date-time/date-time';
import DateFilterPlugin from './date/date';
import I18nFilterPlugin from './i18n/i18n';
import TimeFilterPlugin from './time/time';

const FiltersPlugin: PluginObject<any> = {
    install(v, options): void {

        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin);
        }

        Vue.use(I18nFilterPlugin);
        Vue.use(DateFilterPlugin);
        Vue.use(TimeFilterPlugin);
        Vue.use(DateTimeFilterPlugin);
    }
};

export default FiltersPlugin;
