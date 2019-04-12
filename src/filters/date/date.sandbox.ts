import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import TextfieldPlugin from '../../components/textfield/textfield';
import DateFilterPlugin from './date';
import { dateTimeFilter } from './date-time/date-time';
import WithRender from './date.sandbox.html';
import { dateFilter } from './date/date';
import { ModulPeriod, PeriodFilter } from './period/period';

@WithRender
@Component
export class MDateSandbox extends Vue {
    now: Date = new Date();

    current: any = {
        year: this.now.getFullYear(),
        month: this.now.getMonth() + 1,
        day: 1,
        hours: this.now.getHours(),
        minutes: this.now.getMinutes()
    };

    later: any = {
        year: this.now.getFullYear(),
        month: this.current.month + 1,
        day: this.current.day + 1
    };

    get formattedDateLong(): string {
        return dateFilter(this.date);
    }

    get formattedDateShort(): string {
        return dateFilter(this.date, { shortMode: true });
    }

    get date(): Date {
        return new Date(this.current.year, this.current.month, this.current.day, this.current.hours, this.current.minutes);
    }

    get dateLater(): Date {
        return new Date(this.later.year, this.later.month, this.later.day);
    }

    clearLater(): void {
        this.later = {};
    }

    clearCurrent(): void {
        this.current.year = undefined;
        this.current.month = undefined;
        this.current.day = undefined;
    }

    get formattedDateTimeLong(): string {
        return dateTimeFilter(this.date);
    }

    get formattedDateTimeShort(): string {
        return dateTimeFilter(this.date, true);
    }

    get formattedPeriod(): string {
        let period: ModulPeriod;

        period = {
            start: this.current.year ? this.date : undefined,
            end: this.later.year ? this.dateLater : undefined
        };

        return PeriodFilter.formatPeriod(period);
    }

    get periodThroughFilter(): ModulPeriod {
        return {
            start: this.current.year ? this.date : undefined,
            end: this.later.year ? this.dateLater : undefined
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
