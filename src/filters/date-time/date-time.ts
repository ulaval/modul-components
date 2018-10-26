import Vue, { PluginObject } from 'vue';

import { FormatMode } from '../../utils/i18n/i18n';
import { dateFilter } from '../date/date';
import { DATE_TIME_NAME } from '../filter-names';
import { timeFilter } from '../time/time';

export const dateTimeFilter: (date: Date, short?: boolean) => string = (date, short) => {
    const params: any = {
        date: dateFilter(date, short),
        time: timeFilter(date)
    };
    return Vue.prototype.$i18n.translate(short ? 'f-m-date-time:short' : 'f-m-date-time:long', params, 0, '', true, FormatMode.Vsprintf);
};

const DateTimeFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(DATE_TIME_NAME, dateTimeFilter);
    }
};

export default DateTimeFilterPlugin;
