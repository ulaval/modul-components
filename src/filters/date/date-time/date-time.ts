import Vue from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import { dateFilter } from '../date/date';
import { timeFilter } from '../time/time';


export const dateTimeFilter: (date: Date, short?: boolean) => string = (date, short) => {
    const params: any = {
        date: dateFilter(date, { shortMode: short }),
        time: timeFilter(date)
    };
    return Vue.prototype.$i18n.translate(short ? 'f-m-date-time:short' : 'f-m-date-time:long', params, 0, '', true, FormatMode.Vsprintf);
};

