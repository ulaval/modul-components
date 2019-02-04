import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CALENDAR_NAME } from '../component-names';
import CalendarPlugin from './calendar';
import { RangeDate } from './calendar-state/state/abstract-calendar-state';
import WithRender from './calendar.sandbox.html';

@WithRender
@Component
export class MCalendarSandbox extends Vue {
    date: string = '';
    dateRange: RangeDate = {};
}

const CalendarSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(CalendarPlugin);
        v.component(`${CALENDAR_NAME}-sandbox`, MCalendarSandbox);
    }
};

export default CalendarSandboxPlugin;
