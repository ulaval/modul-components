import Vue from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import ModulDate, { DatePrecision } from '../../../utils/modul-date/modul-date';
import { dateFilter, DateFilterParams } from '../date/date';

export type ModulPeriod = {
    start?: Date,
    end?: Date
};

export enum MFormatMode {
    LongMonth = 'long-month',
    ShortMonth = 'short-month'
}

export class PeriodFilter {

    static formatPeriod(period: ModulPeriod, formatMode?: MFormatMode): string {
        let formattedPeriod: string;
        let shortModeParams: DateFilterParams = {};

        if (formatMode === MFormatMode.ShortMonth) {
            shortModeParams = { shortMode: true };
        }

        if (period.start && period.end) {
            formattedPeriod = PeriodFilter.compactStartAndEndDate(period.start, period.end, shortModeParams);
        } else if (period.start && !period.end) {
            formattedPeriod = PeriodFilter.onlyStartDate(period.start, shortModeParams);
        } else if (period.end && !period.start) {
            formattedPeriod = PeriodFilter.onlyEndDate(period.end, shortModeParams);
        } else {
            throw new Error('Period must have at least one Date');
        }

        return formattedPeriod;
    }

    private static compactStartAndEndDate(start: Date, end: Date, shortModeParams?: DateFilterParams): string {
        let startDate: ModulDate = new ModulDate(start);
        let endDate: ModulDate = new ModulDate(end);
        let formattedPeriod: string;

        if (startDate.isSame(endDate, DatePrecision.DAY)) {
            const startFormatted: string = dateFilter(start, shortModeParams);
            formattedPeriod = this.translateDate('f-m-period:sameDay', { date: startFormatted });
        } else if (startDate.isSame(endDate, DatePrecision.MONTH)) {
            formattedPeriod = this.startAndEndDateSameMonth(start, end, shortModeParams);
        } else if (startDate.isSame(endDate, DatePrecision.YEAR)) {
            formattedPeriod = this.startAndEndDateSameYear(start, end, shortModeParams);
        } else {
            formattedPeriod = this.fullStartAndEndDate(start, end, shortModeParams);
        }
        return formattedPeriod;
    }

    private static onlyStartDate(start: Date, shortModeParams?: DateFilterParams): string {
        const startFormatted: string = dateFilter(start, shortModeParams);
        return this.translateDate('f-m-period:start', { start: startFormatted });
    }

    private static onlyEndDate(end: Date, shortModeParams?: DateFilterParams): string {
        const endFormatted: string = dateFilter(end, shortModeParams);

        return this.translateDate('f-m-period:end', { end: endFormatted });
    }

    private static startAndEndDateSameMonth(start: Date, end: Date, shortModeParams?: DateFilterParams): string {
        const endFormatted: string = dateFilter(end, shortModeParams);
        const monthParams: DateFilterParams = { showMonth: false, showYear: false };
        const dateFilterParams: DateFilterParams = Object.assign(shortModeParams, monthParams);
        const startFormatted: string = dateFilter(start, dateFilterParams);

        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    private static startAndEndDateSameYear(start: Date, end: Date, shortModeParams?: DateFilterParams): string {
        const endFormatted: string = dateFilter(end, shortModeParams);
        const monthParams: DateFilterParams = { showYear: false };
        const dateFilterParams: DateFilterParams = Object.assign(shortModeParams, monthParams);
        const startFormatted: string = dateFilter(start, dateFilterParams);

        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    private static fullStartAndEndDate(start: Date, end: Date, shortModeParams?: DateFilterParams): string {
        const startFormatted: string = dateFilter(start, shortModeParams);
        const endFormatted: string = dateFilter(end, shortModeParams);
        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    private static translateDate(key: string, params: any): string {
        return (Vue.prototype).$i18n.translate(key, params, 0, '', undefined, FormatMode.Vsprintf);
    }
}
