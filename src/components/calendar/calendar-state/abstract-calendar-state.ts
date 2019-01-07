import DateUtil from 'src/utils/date-util/date-util';
import { ModulVue } from '../../../utils';
import { CalendarEvent } from '../calendar-renderer/abstract-calendar-renderer';

export interface CalendarCurrentState {
    calendar: Calendar;
    calendarEvents: CalendarEvents;
}

export interface Calendar {
    dates: { min: DateUtil, current: DateUtil, max: DateUtil };
    years: YearState[];
    months: MonthState[];
    days: DayState[];
}

export interface YearState {
    year: number;
    isCurrent: boolean;
}

export interface MonthState {
    month: number;
    isCurrent: boolean;
    isDisabled: boolean;
}

export interface DayState {
    day: number;
    month: number;
    year: number;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
    isHidden: boolean;
    isHover: boolean;
}

export interface CalendarEvents {
    [CalendarEvent.DATE_SELECT]: (event: Event) => void;
    [CalendarEvent.DATE_MOUSE_ENTER]: (event: Event) => void;
    [CalendarEvent.DATE_MOUSE_LEAVE]: (event: Event) => void;
    [CalendarEvent.MONTH_SELECT]: (event: Event) => void;
    [CalendarEvent.MONTH_PREVIOUS]: (event: Event) => void;
    [CalendarEvent.MONTH_NEXT]: (event: Event) => void;
    [CalendarEvent.YEAR_SELECT]: (event: Event) => void;
    [CalendarEvent.YEAR_PREVIOUS]: (event: Event) => void;
    [CalendarEvent.YEAR_NEXT]: (event: Event) => void;
}

export abstract class MAbstractCalendarState extends ModulVue {

    render(): any {
        return this.$scopedSlots.default!({
            calendar: this.assembleCalendar(),
            calendarEvents: this.assembleCalendarEvents()
        } as CalendarCurrentState);
    }

    abstract assembleCalendar(): Calendar;
    abstract assembleCalendarEvents(): CalendarEvents;
}
