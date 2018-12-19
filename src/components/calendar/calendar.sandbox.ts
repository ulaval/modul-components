import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CALENDAR_NAME } from '../component-names';
import WithRender from './calendar.sandbox.html';


@WithRender
@Component
export class MCalendarSandbox extends Vue {
    public singleDate: string = '';
    public singleDateOptions: string = '';

    private now: Date = new Date();

    get minDate(): string {
        return `${this.now.getFullYear() - 3}-06-15`;
    }

    get maxDate(): string {
        return `${this.now.getFullYear() + 3}-06-15`;
    }
}

const CalendarSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CALENDAR_NAME}-sandbox`, MCalendarSandbox);
    }
};

export default CalendarSandboxPlugin;
