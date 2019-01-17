import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import TextfieldPlugin from '../../components/textfield/textfield';
import { DATE_NAME } from '../filter-names';
import WithRender from './date.sandbox.html';
import { dateFilter } from './date/date';
import DateFilterPlugin from './date';
import { dateTimeFilter } from './date-time/date-time';

@WithRender
@Component
export class MDateSandbox extends Vue {
    now: Date = new Date();

    year: number = this.now.getFullYear();
    month: number = this.now.getMonth() + 1;
    day: number = this.now.getDay();
    hours: number = this.now.getHours();
    minutes: number = this.now.getMinutes();


    get formattedDateLong(): string {
        return dateFilter(this.date);
    }

    get formattedDateShort(): string {
        return dateFilter(this.date, true);
    }

    get date(): Date {
        return new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDay(), this.hours, this.minutes);
    }

    get formattedDateTimeLong(): string {
        return dateTimeFilter(this.date);
    }

    get formattedDateTimeShort(): string {
        return dateTimeFilter(this.date, true);
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
