import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import TextfieldPlugin from '../../components/textfield/textfield';
import { DATE_NAME } from '../filter-names';
import WithRender from './date.sandbox.html';
import { dateFilter } from './date';

@WithRender
@Component
export class MDateSandbox extends Vue {
    now: Date = new Date();

    year: number = this.now.getFullYear();
    month: number = this.now.getMonth() + 1;
    day: number = this.now.getDay();

    get date(): Date {
        return new Date(this.year, this.month - 1, this.day);
    }

    get formattedDateLong(): string {
        return dateFilter(this.date);
    }

    get formattedDateShort(): string {
        return dateFilter(this.date, true);
    }
}

const DateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DATE_NAME}-sandbox`, MDateSandbox);
        v.use(TextfieldPlugin);
    }
};

export default DateSandboxPlugin;
