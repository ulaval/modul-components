import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CALENDAR_NAME } from '../component-names';
import { RangeDate } from './calendar-state/abstract-calendar-state';
import WithRender from './calendar.sandbox.html';


@WithRender
@Component
export class MCalendarSandbox extends Vue {
    date: string = '';
    dateRange: RangeDate = { begin: '2019-01-15' };
}

const CalendarSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CALENDAR_NAME}-sandbox`, MCalendarSandbox);
    }
};

export default CalendarSandboxPlugin;
