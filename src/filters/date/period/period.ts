import Vue from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import { dateFilter } from '../date/date';

export type MPeriod = {
    start?: Date,
    end?: Date
};

export let periodFilter: (period: MPeriod) => string = (period) => {
    let formattedPeriod: string;
    if (period.start && period.end) {
        formattedPeriod = bothStartAndEndDate(period.start, period.end);
    } else if (period.start && !period.end) {
        formattedPeriod = onlyStartDate(period.start);
    } else if (period.end && !period.start) {
        formattedPeriod = onlyEndDate(period.end);
    } else {
        throw new Error('Period must have at least one Date');
    }

    return formattedPeriod;
};

let onlyStartDate: (start: Date) => string = (start) => {
    const startFormatted: string = dateFilter(start);
    return (Vue.prototype).$i18n.translate('f-m-period:start', { start: startFormatted }, 0, '', undefined, FormatMode.Vsprintf);
};

let onlyEndDate: (end: Date) => string = (end) => {
    const endFormatted: string = dateFilter(end);
    return (Vue.prototype).$i18n.translate('f-m-period:end', { end: endFormatted }, 0, '', undefined, FormatMode.Vsprintf);
};

let bothStartAndEndDate: (start: Date, end: Date) => string = (start, end) => {
    const startFormatted: string = dateFilter(start);
    const endFormatted: string = dateFilter(end);
    const params: any = {
        start: startFormatted,
        end: endFormatted
    };
    return (Vue.prototype).$i18n.translate('f-m-period:dates', params, 0, '', undefined, FormatMode.Vsprintf);
};
