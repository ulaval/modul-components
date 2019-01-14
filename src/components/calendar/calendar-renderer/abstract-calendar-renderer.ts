import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils';
import { Calendar, CalendarEvent, DayState, MonthState, YearState } from '../calendar-state/state/calendar-state';

export abstract class MAbstractCalendarRenderer extends ModulVue {
    @Prop({ required: true })
    calendar: Calendar;

    onDaySelect(day: DayState): void {
        this.$emit(CalendarEvent.DAY_SELECT, day);
    }

    onDayMouseEnter(day: DayState): void {
        this.$emit(CalendarEvent.DAY_MOUSE_ENTER, day);
    }

    onDayMouseLeave(day: DayState): void {
        this.$emit(CalendarEvent.DAY_MOUSE_LEAVE, day);
    }

    onMonthSelect(month: MonthState): void {
        this.$emit(CalendarEvent.MONTH_SELECT, month);
    }

    onMonthNext(event: Event): void {
        this.$emit(CalendarEvent.MONTH_NEXT, event);
    }

    onMonthPrevious(event: Event): void {
        this.$emit(CalendarEvent.MONTH_PREVIOUS, event);
    }

    onYearSelect(year: YearState): void {
        this.$emit(CalendarEvent.YEAR_SELECT, year);
    }

    onYearNext(event: Event): void {
        this.$emit(CalendarEvent.YEAR_NEXT, event);
    }

    onYearPrevious(event: Event): void {
        this.$emit(CalendarEvent.YEAR_PREVIOUS, event);
    }
}
