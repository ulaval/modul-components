import 'moment/locale/fr';
import { PluginObject } from 'vue';
import { DATE_NAME, DATE_TIME_NAME, PERIOD_NAME, TIME_NAME } from '../filter-names';
import { dateTimeFilter } from './date-time/date-time';
import { dateFilter } from './date/date';
import { PeriodFilter } from './period/period';
import { timeFilter } from './time/time';

const DateFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(DATE_NAME, dateFilter);
        v.filter(DATE_TIME_NAME, dateTimeFilter);
        v.filter(TIME_NAME, timeFilter);
        v.filter(PERIOD_NAME, PeriodFilter.formatPeriod);
    }
};

export default DateFilterPlugin;
