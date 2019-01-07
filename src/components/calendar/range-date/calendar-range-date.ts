import { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import { CALENDAR_RANGE_DATE_NAME } from '../../component-names';
import { MSimpleCalendar } from '../calendar-renderer/simple-calendar';
import { MCalendarRangeDateState } from '../calendar-state/calendar-range-date-state';
import WithRender from './calendar-range-date.html?style=./calendar-range-date.scss';


@WithRender
@Component({
    components: {
        MCalendarRangeDateState,
        MSimpleCalendar
    }
})
export class MCalendarRangeDate extends ModulVue {

    @Prop()
    value: string;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    @Prop({ default: true })
    showMonthBeforeAfter: boolean;

    innerValue: string = this.value;

    @Watch('value')
    refreshValue(): void {
        this.innerValue = this.value;
    }

    onInput(): void {
        this.$emit('input', this.innerValue);
    }
}

const CalendarRangeDatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(CALENDAR_RANGE_DATE_NAME + ' is not ready for production');
        v.component(CALENDAR_RANGE_DATE_NAME, MCalendarRangeDate);
    }
};

export default CalendarRangeDatePlugin;
