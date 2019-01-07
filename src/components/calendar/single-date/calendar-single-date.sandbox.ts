import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CALENDAR_SINGLE_DATE_NAME } from '../../../components/component-names';
import WithRender from './calendar-single-date.sandbox.html';


@WithRender
@Component
export class MCalendarSingleDateSandbox extends Vue {
    public date: string = '2019-01-15';
}

const CalendarSingleDateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CALENDAR_SINGLE_DATE_NAME}-sandbox`, MCalendarSingleDateSandbox);
    }
};

export default CalendarSingleDateSandboxPlugin;
