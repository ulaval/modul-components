import Vue from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import ModulDate, { DatePrecision } from '../../../utils/modul-date/modul-date';
import { dateFilter } from '../date/date';

export type ModulPeriod = {
    start?: Date,
    end?: Date
};

export enum PeriodFilterMode {
    FULLMODE = 'full',
    COMPACTMODE = 'compact'
}

export interface PeriodFilterParams {
    mode?: PeriodFilterMode;
}

export class PeriodFilter {
    static formatPeriod(period: ModulPeriod, params: PeriodFilterParams = { mode: PeriodFilterMode.COMPACTMODE }): string {
        let formattedPeriod: string;

        if (params.mode === PeriodFilterMode.FULLMODE && period.start && period.end) {
            formattedPeriod = PeriodFilter.fullStartAndEndDate(period.start, period.end);
        } else if (period.start && period.end) {
            formattedPeriod = PeriodFilter.compactStartAndEndDate(period.start, period.end);
        } else if (period.start && !period.end) {
            formattedPeriod = PeriodFilter.onlyStartDate(period.start);
        } else if (period.end && !period.start) {
            formattedPeriod = PeriodFilter.onlyEndDate(period.end);
        } else {
            throw new Error('Period must have at least one Date');
        }

        return formattedPeriod;
    }

    private static compactStartAndEndDate(start: Date, end: Date): string {
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

    private static onlyStartDate(start: Date): string {
        const startFormatted: string = dateFilter(start);
        return this.translateDate('f-m-period:start', { start: startFormatted });
    }

    private static onlyEndDate(end: Date): string {
        const endFormatted: string = dateFilter(end);

        return this.translateDate('f-m-period:end', { end: endFormatted });
    }

    private static startAndEndDateSameMonth(start: Date, end: Date): string {
        const startFormatted: string = dateFilter(start, { showMonth: false, showYear: false });
        const endFormatted: string = dateFilter(end);

        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    private static startAndEndDateSameYear(start: Date, end: Date): string {
        const startFormatted: string = dateFilter(start, { showYear: false });
        const endFormatted: string = dateFilter(end);

        const params: any = {
            start: startFormatted,
            end: endFormatted
        };

        return this.translateDate('f-m-period:dates', params);
    }

    private static fullStartAndEndDate(start: Date, end: Date): string {
        const startFormatted: string = dateFilter(start);
        const endFormatted: string = dateFilter(end);
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
