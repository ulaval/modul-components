import 'moment/locale/fr';

import moment, { Moment } from 'moment';
import Vue, { PluginObject } from 'vue';

import { TIME_NAME } from '../../filter-names';

export const timeFilter: (date: Date) => string = (date) => {
    const momentDate: Moment = moment(date);
    return momentDate.format(Vue.prototype.$i18n.translate(momentDate.minutes() ? 'f-m-time:hours-minutes' : 'f-m-time:hours'));
};

