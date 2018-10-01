import 'moment/locale/fr';

import moment from 'moment';
import Vue, { PluginObject } from 'vue';

import { FormatMode } from '../../utils/i18n/i18n';
import { DATE_NAME } from '../filter-names';

export let dateFilter: (date: Date, short?: boolean) => string = (date, short) => {
    return moment(date).format(Vue.prototype.$i18n.translate(short ? 'f-m-date:short' : 'f-m-date:long', 0, '', true, FormatMode.Vsprintf));
};

const DateFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(DATE_NAME, dateFilter);
    }
};

export default DateFilterPlugin;
