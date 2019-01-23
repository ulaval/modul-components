import 'moment/locale/fr';

import moment from 'moment';
import Vue, { PluginObject } from 'vue';

import { FormatMode, Messages } from '../../utils/i18n/i18n';
import { DATE_NAME, DATE_TIME_NAME, TIME_NAME } from '../filter-names';

import { timeFilter } from './time/time';
import { dateFilter } from './date/date';
import { dateTimeFilter } from './date-time/date-time';


const DateFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(DATE_NAME, dateFilter);
        v.filter(DATE_TIME_NAME, dateTimeFilter);
        v.filter(TIME_NAME, timeFilter);
    }
};

export default DateFilterPlugin;
