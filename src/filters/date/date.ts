import moment from 'moment';
import Vue, { PluginObject } from 'vue';

import { DATE_NAME } from '../filter-names';

export let dateFilter: (date: Date, short?: boolean) => string = (date, short) => {
    const key: string = short ? 'f-m-date:short' : 'f-m-date:long';
    return moment(date).format(Vue.prototype.$i18n.translate(key));
};

const DateFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(DATE_NAME, dateFilter);
    }
};

export default DateFilterPlugin;
