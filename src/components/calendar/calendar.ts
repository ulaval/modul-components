import { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { CALENDAR_NAME } from '../component-names';
import { MSimpleCalendar } from './calendar-renderer/simple-calendar';
import { RangeDate, SingleDate } from './calendar-state/abstract-calendar-state';
import { MCalendarRangeDateState } from './calendar-state/calendar-range-date-state';
import { MCalendarSingleDateState } from './calendar-state/calendar-single-date-state';
import WithRender from './calendar.html?style=./calendar.scss';


enum CalendarMode {
    SINGLE_DATE = 'single-date',
    DATE_RANGE = 'date-range'
}

@WithRender
@Component({
    components: {
        MCalendarSingleDateState,
        MCalendarRangeDateState,
        MSimpleCalendar
    }
})
export class MCalendar extends ModulVue {

    @Prop({ default: '' })
    value: SingleDate | RangeDate;

    @Prop({ default: CalendarMode.SINGLE_DATE })
    mode: CalendarMode;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    @Prop({ default: true })
    showMonthBeforeAfter: string;

    innerValue: SingleDate | RangeDate = this.value;

    @Watch('value')
    refreshValue(): void {
        this.innerValue = this.value;
    }

    onInput(): void {
        this.$emit('input', this.innerValue);
    }

    get isSingleDate(): boolean {
        return this.mode === CalendarMode.SINGLE_DATE;
    }

    get isDateRange(): boolean {
        return this.mode === CalendarMode.DATE_RANGE;
    }
}

const CalendarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(CALENDAR_NAME + ' is not ready for production');
        v.component(CALENDAR_NAME, MCalendar);
    }
};

export default CalendarPlugin;
