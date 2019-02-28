import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import TextfieldPlugin from '../../components/textfield/textfield';
import DateFilterPlugin from './date';
import { dateTimeFilter } from './date-time/date-time';
import WithRender from './date.sandbox.html';
import { dateFilter } from './date/date';
import { ModulPeriod, PeriodFilter, PeriodFilterMode } from './period/period';

@WithRender
@Component
export class MDateSandbox extends Vue {
    now: Date = new Date();

    year: number = this.now.getFullYear();
    month: number = this.now.getMonth() + 1;
    day: number = 1;
    hours: number = this.now.getHours();
    minutes: number = this.now.getMinutes();

    yearLater: number = this.now.getFullYear();
    monthLater: number = this.month + 1;
    dayLater: number = this.day + 1;

    get formattedDateLong(): string {
        return dateFilter(this.date);
    }

    get formattedDateShort(): string {
        return dateFilter(this.date, { shortMode: true });
    }

    get date(): Date {
        return new Date(this.year, this.month, this.day, this.hours, this.minutes);
    }

    get dateLater(): Date {
        return new Date(this.yearLater, this.monthLater, this.dayLater);
    }

    get formattedDateTimeLong(): string {
        return dateTimeFilter(this.date);
    }

    get formattedDateTimeShort(): string {
        return dateTimeFilter(this.date, true);
    }

    get formattedPeriod(): string {
        const period: ModulPeriod = {
            start: this.date,
            end: this.dateLater
        };

        return PeriodFilter.formatPeriod(period);
    }

    get formattedPeriodFullMode(): string {
        const period: ModulPeriod = {
            start: this.date,
            end: this.dateLater
        };

        return PeriodFilter.formatPeriod(period, { mode: PeriodFilterMode.FULLMODE });
    }

    get periodThroughFilter(): ModulPeriod {
        return {
            start: this.date,
            end: this.dateLater
        };
    }
}

const DateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-date-sandbox`, MDateSandbox);
        v.use(TextfieldPlugin);
        v.use(DateFilterPlugin);
    }
};

export default DateSandboxPlugin;
