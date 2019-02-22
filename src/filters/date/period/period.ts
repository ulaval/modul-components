import Vue from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import ModulDate, { DatePrecision } from '../../../utils/modul-date/modul-date';
import { dateFilter } from '../date/date';

export type MPeriod = {
    start?: Date,
    end?: Date
};

export interface MPeriodFilterParams {
    period: MPeriod;
    fullMode?: boolean;
}

export class PeriodFilter {
    static formatPeriod(params: MPeriodFilterParams): string {
        let formattedPeriod: string;

        if (params.fullMode && params.period.start && params.period.end) {
            formattedPeriod = PeriodFilter.fullStartAndEndDate(params.period.start, params.period.end);
        } else if (params.period.start && params.period.end) {
            formattedPeriod = PeriodFilter.compactStartAndEndDate(params.period.start, params.period.end);
        } else if (params.period.start && !params.period.end) {
            formattedPeriod = PeriodFilter.onlyStartDate(params.period.start);
        } else if (params.period.end && !params.period.start) {
            formattedPeriod = PeriodFilter.onlyEndDate(params.period.end);
        } else {
            throw new Error('Period must have at least one Date');
        }

        return formattedPeriod;
    }

    static compactStartAndEndDate(start: Date, end: Date): string {
        let startDate: ModulDate = new ModulDate(start);
        let endDate: ModulDate = new ModulDate(end);
        let formattedPeriod: string;

        if (startDate.isSame(endDate, DatePrecision.DAY)) {
            const startFormatted: string = dateFilter(start);
            formattedPeriod = this.translateDate('f-m-period:sameDay', { date: startFormatted });
        } else if (startDate.isSame(endDate, DatePrecision.MONTH)) {
            formattedPeriod = this.startAndEndDateSameMonth(start, end);
        } else if (startDate.isSame(endDate, DatePrecision.YEAR)) {
            formattedPeriod = this.startAndEndDateSameYear(start, end);
        } else {
            formattedPeriod = this.fullStartAndEndDate(start, end);
        }
        return formattedPeriod;
    }

    static onlyStartDate(start: Date): string {
        const startFormatted: string = dateFilter(start);
        return this.translateDate('f-m-period:start', { start: startFormatted });
    }

    static onlyEndDate(end: Date): string {
        const endFormatted: string = dateFilter(end);

        return this.translateDate('f-m-period:end', { end: endFormatted });
    }

    static startAndEndDateSameMonth(start: Date, end: Date): string {
        const startFormatted: string = dateFilter(start, { showMonth: false, showYear: false });
        const endFormatted: string = dateFilter(end);

        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    static startAndEndDateSameYear(start: Date, end: Date): string {
        const startFormatted: string = dateFilter(start, { showYear: false });
        const endFormatted: string = dateFilter(end);

        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    static fullStartAndEndDate(start: Date, end: Date): string {
        const startFormatted: string = dateFilter(start);
        const endFormatted: string = dateFilter(end);
        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    static translateDate(key: string, params: any): string {
        return (Vue.prototype).$i18n.translate(key, params, 0, '', undefined, FormatMode.Vsprintf);
    }
}
