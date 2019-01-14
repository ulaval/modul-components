import DateUtil from '../../../../utils/date-util/date-util';
import { RangeDate, SingleDate } from './abstract-calendar-state';

export enum CalendarEvent {
    DAY_SELECT = 'day-select',
    DAY_MOUSE_ENTER = 'day-mouse-enter',
    DAY_MOUSE_LEAVE = 'day-mouse-leave',
    MONTH_SELECT = 'month-select',
    MONTH_NEXT = 'month-next',
    MONTH_PREVIOUS = 'month-previous',
    YEAR_SELECT = 'year-select',
    YEAR_NEXT = 'year-next',
    YEAR_PREVIOUS = 'year-previous'
}

export default interface CalendarState {
    buildCurrentCalendar(): CalendarCurrentState;
    onDateSelect(callback: (date: SingleDate | RangeDate) => void): void;
    updateValue(value: SingleDate | RangeDate): void;
}

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

export interface CalendarEvents {
    [CalendarEvent.DAY_SELECT]: (event: DayState) => void;
    [CalendarEvent.DAY_MOUSE_ENTER]: (event: DayState) => void;
    [CalendarEvent.DAY_MOUSE_LEAVE]: (event: DayState) => void;
    [CalendarEvent.MONTH_SELECT]: (event: MonthState) => void;
    [CalendarEvent.MONTH_PREVIOUS]: (event: Event) => void;
    [CalendarEvent.MONTH_NEXT]: (event: Event) => void;
    [CalendarEvent.YEAR_SELECT]: (event: YearState) => void;
    [CalendarEvent.YEAR_PREVIOUS]: (event: Event) => void;
    [CalendarEvent.YEAR_NEXT]: (event: Event) => void;
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
    isInPreviousMonth: boolean;
    isInNextMonth: boolean;
    isHighlighted: boolean;
    hasFocus: boolean;
}
