import { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import { CALENDAR_SINGLE_DATE_NAME } from '../../component-names';
import { MSimpleCalendar } from '../calendar-renderer/simple-calendar';
import { MCalendarSingleDateState } from '../calendar-state/calendar-single-date-state';
import WithRender from './calendar-single-date.html?style=./calendar-single-date.scss';


@WithRender
@Component({
    components: {
        MCalendarSingleDateState,
        MSimpleCalendar
    }
})
export class MCalendarSingleDate extends ModulVue {

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

const CalendarSingleDatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(CALENDAR_SINGLE_DATE_NAME + ' is not ready for production');
        v.component(CALENDAR_SINGLE_DATE_NAME, MCalendarSingleDate);
    }
};

export default CalendarSingleDatePlugin;
