import ModulDate from './../../../../utils/modul-date/modul-date';
import { RangeDate, SingleDate } from './abstract-calendar-state';

export enum CalendarEvent {
    DAY_SELECT = 'day-select',
    DAY_MOUSE_ENTER = 'day-mouse-enter',
    DAY_MOUSE_LEAVE = 'day-mouse-leave',
    DAY_KEYBOARD_TAB = 'day-keyboard-tab',
    MONTH_SELECT = 'month-select',
    MONTH_NEXT = 'month-next',
    MONTH_PREVIOUS = 'month-previous',
    YEAR_SELECT = 'year-select',
    YEAR_NEXT = 'year-next',
    YEAR_PREVIOUS = 'year-previous',
    YEAR_MONTH_SELECT = 'year-month-select'
}

export enum CalendarType {
    SINGLE_DATE = 'single-date',
    DATE_RANGE = 'date-range'
}

export type DaySelectCallBack = (date: SingleDate | RangeDate) => void;

export default interface CalendarState {
    buildCurrentCalendar(): CalendarCurrentState;
    onDateSelect(callback: DaySelectCallBack): void;
    updateState(value: SingleDate | RangeDate, minDate?: string, maxDate?: string): void;
}

export interface CalendarCurrentState {
    calendar: Calendar;
    calendarEvents: CalendarEvents;
}

export interface Calendar {
    value?: SingleDate | RangeDate;
    dates: { min: ModulDate, current: ModulDate, max: ModulDate };
    years: YearState[];
    months: MonthState[];
    yearsMonths: YearMonthState[];
    days: DayState[];
    type?: CalendarType;
}

export interface CalendarEvents {
    [CalendarEvent.DAY_SELECT]: (event: DayState) => void;
    [CalendarEvent.DAY_MOUSE_ENTER]: (event: DayState) => void;
    [CalendarEvent.DAY_MOUSE_LEAVE]: (event: DayState) => void;
    [CalendarEvent.DAY_KEYBOARD_TAB]: (event: DayState) => void;
    [CalendarEvent.MONTH_SELECT]: (event: MonthState) => void;
    [CalendarEvent.MONTH_PREVIOUS]: (event: Event) => void;
    [CalendarEvent.MONTH_NEXT]: (event: Event) => void;
    [CalendarEvent.YEAR_SELECT]: (event: YearState) => void;
    [CalendarEvent.YEAR_PREVIOUS]: (event: Event) => void;
    [CalendarEvent.YEAR_NEXT]: (event: Event) => void;
    [CalendarEvent.YEAR_MONTH_SELECT]: (event: Event) => void;
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

export interface YearMonthState {
    year: YearState;
    months: MonthState[];
}

export interface DayState {
    date: ModulDate;
    day: number;
    month: number;
    year: number;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
    isSelectionStart: boolean;
    isSelectionEnd: boolean;
    isInPreviousMonth: boolean;
    isInNextMonth: boolean;
    isHighlighted: boolean;
    hasFocus: boolean;
}
