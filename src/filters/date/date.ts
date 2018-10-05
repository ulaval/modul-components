import 'moment/locale/fr';

import moment from 'moment';
import Vue, { PluginObject } from 'vue';

import { FormatMode, Messages } from '../../utils/i18n/i18n';
import { DATE_NAME } from '../filter-names';

export let dateFilter: (date: Date, short?: boolean) => string = (date, short) => {
    let i18n: Messages = (Vue.prototype as any).$i18n as Messages;
    return moment(date).format(i18n.translate(short ? 'f-m-date:short' : 'f-m-date:long', undefined, 0, '', undefined, FormatMode.Vsprintf));
};

const DateFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(DATE_NAME, dateFilter);
    }
};

export default DateFilterPlugin;
