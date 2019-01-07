import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CALENDAR_RANGE_DATE_NAME } from '../../../components/component-names';
import { RangeDate } from '../calendar-state/abstract-calendar-state';
import WithRender from './calendar-range-date.sandbox.html';


@WithRender
@Component
export class MCalendarRangeDateSandbox extends Vue {
    public date: RangeDate = { begin: '2019-01-15' };
}

const CalendarRangeDateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CALENDAR_RANGE_DATE_NAME}-sandbox`, MCalendarRangeDateSandbox);
    }
};

export default CalendarRangeDateSandboxPlugin;
