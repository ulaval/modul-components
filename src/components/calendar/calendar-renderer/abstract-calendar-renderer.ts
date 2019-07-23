import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import { Calendar, CalendarEvent, DayState, MonthState, YearState } from '../calendar-state/state/calendar-state';

export abstract class MAbstractCalendarRenderer extends ModulVue {
    @Prop({ required: true })
    calendar: Calendar;

    @Emit(CalendarEvent.DAY_SELECT)
    onDaySelect(day: DayState): void {
    }

    @Emit(CalendarEvent.DAY_MOUSE_ENTER)
    onDayMouseEnter(day: DayState): void {
    }

    @Emit(CalendarEvent.DAY_MOUSE_LEAVE)
    onDayMouseLeave(day: DayState): void {
    }

    @Emit(CalendarEvent.DAY_KEYBOARD_TAB)
    onDayKeyboardTab(day: DayState): void {
    }

    @Emit(CalendarEvent.MONTH_SELECT)
    onMonthSelect(month: MonthState): void {
    }

    @Emit(CalendarEvent.MONTH_NEXT)
    onMonthNext(event: Event): void {
    }

    @Emit(CalendarEvent.MONTH_PREVIOUS)
    onMonthPrevious(event: Event): void {
    }

    @Emit(CalendarEvent.YEAR_SELECT)
    onYearSelect(year: YearState): void {
    }

    @Emit(CalendarEvent.YEAR_MONTH_SELECT)
    onYearMonthSelect(year: YearState, month: MonthState): void {
    }

    @Emit(CalendarEvent.YEAR_NEXT)
    onYearNext(event: Event): void {
    }

    @Emit(CalendarEvent.YEAR_PREVIOUS)
    onYearPrevious(event: Event): void {
    }
}
