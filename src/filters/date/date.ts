import 'moment/locale/fr';
import { PluginObject } from 'vue';
import { DATE_NAME, DATE_TIME_NAME, PERIOD_NAME } from '../filter-names';
import { dateTimeFilter } from './date-time/date-time';
import { dateFilter } from './date/date';
import { PeriodFilter } from './period/period';
import TimeFilterPlugin from './time/time';

const DateFilterPlugin: PluginObject<any> = {
    install(v): void {
        v.filter(DATE_NAME, dateFilter);
        v.filter(DATE_TIME_NAME, dateTimeFilter);
        v.use(TimeFilterPlugin);
        v.filter(PERIOD_NAME, PeriodFilter.formatPeriod);
    }
};

export default DateFilterPlugin;
