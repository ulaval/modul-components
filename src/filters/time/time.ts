import moment, { Moment } from 'moment';
import Vue, { PluginObject } from 'vue';

import { NBSP } from '../../utils/str/str';
import { TIME_NAME } from '../filter-names';

export const timeFilter: (date: Date) => string = (date) => {
    const momentDate: Moment = moment(date);
    return momentDate.format(`H[${NBSP}h]` + (momentDate.minutes() ? `[${NBSP}]mm` : ''));
};

const TimeFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(TIME_NAME, timeFilter);
    }
};

export default TimeFilterPlugin;
