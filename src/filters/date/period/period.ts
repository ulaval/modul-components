import Vue from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import ModulDate, { DatePrecision } from '../../../utils/modul-date/modul-date';
import { dateFilter } from '../date/date';

export type MPeriod = {
    start?: Date,
    end?: Date
};

export interface MShowPeriodParams {
    period: MPeriod;
    fullMode?: boolean;
}

export let periodFilter: (params: MShowPeriodParams) => string = (params) => {
    let formattedPeriod: string;

    if (params.fullMode && params.period.start && params.period.end) {
        formattedPeriod = fullStartAndEndDate(params.period.start, params.period.end);
    } else if (params.period.start && params.period.end) {
        formattedPeriod = compactStartAndEndDate(params.period.start, params.period.end);
    } else if (params.period.start && !params.period.end) {
        formattedPeriod = onlyStartDate(params.period.start);
    } else if (params.period.end && !params.period.start) {
        formattedPeriod = onlyEndDate(params.period.end);
    } else {
        throw new Error('Period must have at least one Date');
    }

    return formattedPeriod;
};

let onlyStartDate: (start: Date) => string = (start) => {
    const startFormatted: string = dateFilter(start);
    return translateDate('f-m-period:start', { start: startFormatted });
};

let onlyEndDate: (end: Date) => string = (end) => {
    const endFormatted: string = dateFilter(end);
    return translateDate('f-m-period:end', { end: endFormatted });
};

let fullStartAndEndDate: (start: Date, end: Date) => string = (start, end) => {
    const startFormatted: string = dateFilter(start);
    const endFormatted: string = dateFilter(end);
    const params: any = {
        start: startFormatted,
        end: endFormatted
    };
    return translateDate('f-m-period:dates', params);
};

let compactStartAndEndDate: (start: Date, end: Date) => string = (start, end) => {
    let startDate: ModulDate = new ModulDate(start);
    let endDate: ModulDate = new ModulDate(end);
    let formattedPeriod: string;

    if (startDate.isSame(endDate, DatePrecision.DAY)) {
        const startFormatted: string = dateFilter(start);
        formattedPeriod = translateDate('f-m-period:sameDay', { date: startFormatted });
    } else {
        formattedPeriod = fullStartAndEndDate(start, end);
    }
    return formattedPeriod;
};

let translateDate: (key: string, params: any) => string = (key, params) => {
    return (Vue.prototype).$i18n.translate(key, params, 0, '', undefined, FormatMode.Vsprintf);
};
