import Vue from 'vue';
import { FormatMode, Messages } from '../../../utils/i18n/i18n';
import { dateFilter } from '../date/date';

export type MPeriod = {
    start: Date,
    end: Date
};

export let periodFilter: (period: MPeriod) => string = (period) => {
    let i18n: Messages = (Vue.prototype).$i18n as Messages;
    const startFormatted: string = dateFilter(period.start);
    const endFormatted: string = dateFilter(period.end);
    const params: any = {
        start: startFormatted,
        end: endFormatted
    };
    const formattedPeriod: string = i18n.translate('f-m-period:dates', params, 0, '', undefined, FormatMode.Vsprintf);
    return formattedPeriod;
};
