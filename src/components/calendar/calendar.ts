import { PluginObject } from 'vue';
import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Enums } from '../../utils/enums/enums';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { CALENDAR_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import LinkPlugin from '../link/link';
import MBaseCalendar, { MBaseCalendarType, MBaseCalendarView } from './calendar-renderer/base-calendar/base-calendar';
import MCalendarStateMachine from './calendar-state/calendar-state-machine';
import { RangeDate, SingleDate } from './calendar-state/state/abstract-calendar-state';
import WithRender from './calendar.html?style=./calendar.scss';

export enum CalendarMode {
    SINGLE_DATE = 'single-date',
    DATE_RANGE = 'date-range'
}

export enum MCalendarType {
    FullDate = 'full-date',
    YearsMonths = 'years-months'
}

@WithRender
@Component({
    components: {
        MCalendarStateMachine,
        MBaseCalendar
    }
})
export class MCalendar extends ModulVue {

    @Prop({ default: '' })
    value: SingleDate | RangeDate;

    @Prop({ default: CalendarMode.SINGLE_DATE })
    mode: CalendarMode;

    @Prop({
        default: MBaseCalendarType.FULL_DATE,
        validator: value => Enums.toValueArray(MBaseCalendarType).includes(value)
    })
    type: MBaseCalendarType;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    @Prop({ default: true })
    showMonthBeforeAfter: string;

    @Prop({ default: true })
    visible: boolean;

    @Prop({
        default: MBaseCalendarView.DAYS,
        validator: value => Enums.toValueArray(MBaseCalendarView).includes(value)
    })
    initialView: MBaseCalendarView;

    innerValue: SingleDate | RangeDate = this.value;
    id: string = `m-calendar-${uuid.generate()}`;

    @Watch('value')
    refreshValue(): void {
        this.validateInputModel();
        this.innerValue = this.value;
    }

    created(): void {
        this.validateInputModel();
    }

    @Emit('input')
    onInput(): SingleDate | RangeDate {
        return this.innerValue;
    }

    get isSingleDate(): boolean {
        return this.mode === CalendarMode.SINGLE_DATE;
    }

    get isDateRange(): boolean {
        return this.mode === CalendarMode.DATE_RANGE;
    }

    validateInputModel(): void {
        switch (this.mode) {
            case CalendarMode.SINGLE_DATE:
                if (typeof this.value !== 'string') {
                    throw new Error(`In '${CalendarMode.SINGLE_DATE}' mode, the model type should be a 'string'`);
                }
                break;
            case CalendarMode.DATE_RANGE:
                if (typeof this.value !== 'object') {
                    throw new Error(`In '${CalendarMode.DATE_RANGE}' mode, the model type should be an 'object'`);
                }
                break;
        }
    }
}

const CalendarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconButtonPlugin);
        v.use(LinkPlugin);
        v.component(CALENDAR_NAME, MCalendar);
    }
};

export default CalendarPlugin;
