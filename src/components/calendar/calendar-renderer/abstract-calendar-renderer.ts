import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils';
import { Calendar } from '../calendar-state/abstract-calendar-state';


export enum CalendarEvent {
    DATE_SELECT = 'date-select',
    DATE_MOUSE_ENTER = 'date-mouse-enter',
    DATE_MOUSE_LEAVE = 'date-mouse-leave',
    MONTH_SELECT = 'month-select',
    MONTH_NEXT = 'month-next',
    MONTH_PREVIOUS = 'month-previous',
    YEAR_SELECT = 'year-select',
    YEAR_NEXT = 'year-next',
    YEAR_PREVIOUS = 'year-previous'
}

export abstract class MAbstractCalendarRenderer extends ModulVue {
    @Prop({ required: true })

    calendar: Calendar;

    onDateSelect(event: Event): void {
        this.$emit(CalendarEvent.DATE_SELECT, event);
    }

    onDateMouseEnter(event: Event): void {
        this.$emit(CalendarEvent.DATE_MOUSE_ENTER, event);
    }

    onDateMouseLeave(event: Event): void {
        this.$emit(CalendarEvent.DATE_MOUSE_LEAVE, event);
    }

    onMonthSelect(event: Event): void {
        this.$emit(CalendarEvent.MONTH_SELECT, event);
    }

    onMonthNext(event: Event): void {
        this.$emit(CalendarEvent.MONTH_NEXT, event);
    }

    onMonthPrevious(event: Event): void {
        this.$emit(CalendarEvent.MONTH_PREVIOUS, event);
    }

    onYearSelect(event: Event): void {
        this.$emit(CalendarEvent.YEAR_SELECT, event);
    }

    onYearNext(event: Event): void {
        this.$emit(CalendarEvent.YEAR_NEXT, event);
    }

    onYearPrevious(event: Event): void {
        this.$emit(CalendarEvent.YEAR_PREVIOUS, event);
    }
}
