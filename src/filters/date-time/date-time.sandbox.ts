import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import TextfieldPlugin from '../../components/textfield/textfield';
import { DATE_TIME_NAME } from '../filter-names';
import WithRender from './date-time.sandbox.html';

@WithRender
@Component
export class MDateTimeSandbox extends Vue {
    now: Date = new Date();

    year: number = this.now.getFullYear();
    month: number = this.now.getMonth() + 1;
    day: number = this.now.getDay();
    hours: number = this.now.getHours();
    minutes: number = this.now.getMinutes();

    get date(): Date {
        return new Date(this.year, this.month - 1, this.day, this.hours, this.minutes);
    }
}

const DateTimeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DATE_TIME_NAME}-sandbox`, MDateTimeSandbox);
        v.use(TextfieldPlugin);
    }
};

export default DateTimeSandboxPlugin;
