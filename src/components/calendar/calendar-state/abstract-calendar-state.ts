import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import { CalendarEvent } from '../calendar-renderer/abstract-calendar-renderer';

export const MAX_DATE_OFFSET: number = 10;
export const MIN_DATE_OFFSET: number = 10;

export const FIRST_MONTH_INDEX: number = 0;
export const LAST_MONTH_INDEX: number = 11;

export const LAST_DAY_OF_WEEK_INDEX: number = 6;

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
    isInCurrentMonth: boolean;
    isHighlighted: boolean;
    hasFocus: boolean;
}

export type SingleDate = string;
export interface RangeDate {
    begin?: string;
    end?: string;
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

export abstract class MAbstractCalendarState extends ModulVue {

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    protected now: DateUtil = new DateUtil();

    protected currentlyDisplayedDate: DateUtil = new DateUtil();
    protected currentMinDate: DateUtil = new DateUtil();
    protected currentMaxDate: DateUtil = new DateUtil();

    private calendar: Calendar = {
        dates: { min: new DateUtil(), current: new DateUtil(), max: new DateUtil() },
        years: [],
        months: [],
        days: []
    };

    private events: CalendarEvents;

    private lastSelectedDate: DateUtil;

    refreshValue(): void {
        this.initDates();
    }

    render(): any {
        return this.$scopedSlots.default!({
            calendar: this.assembleCalendar(),
            calendarEvents: this.assembleCalendarEvents()
        } as CalendarCurrentState);
    }

    created(): void {
        this.initDates();
    }

    assembleCalendar(): Calendar {
        this.calendar.dates = {
            min: this.currentMinDate,
            current: this.currentlyDisplayedDate,
            max: this.currentMaxDate
        };
        this.calendar.years = this.years;
        this.calendar.months = this.months;
        this.calendar.days = this.daysOfMonth;
        return this.calendar;
    }

    assembleCalendarEvents(): CalendarEvents {
        if (!this.events) {
            this.events = {
                [CalendarEvent.DAY_SELECT]: this.selectDay.bind(this),
                [CalendarEvent.DAY_MOUSE_ENTER]: () => { },
                [CalendarEvent.DAY_MOUSE_LEAVE]: () => { },
                [CalendarEvent.MONTH_SELECT]: this.selectMonth.bind(this),
                [CalendarEvent.MONTH_PREVIOUS]: this.previousMonth.bind(this),
                [CalendarEvent.MONTH_NEXT]: this.nextMonth.bind(this),
                [CalendarEvent.YEAR_SELECT]: this.selectYear.bind(this),
                [CalendarEvent.YEAR_PREVIOUS]: this.previousYear.bind(this),
                [CalendarEvent.YEAR_NEXT]: this.nextYear.bind(this)
            };

            this.events = this.overrideCalendarEvents(this.events);
        }
        return this.events;
    }

    selectDay(selectedDay: DayState): void {
        this.lastSelectedDate = this.selectedDayToDate(selectedDay);
    }

    initDates(): void {
        this.initCurrentDate();

        this.currentMinDate = new DateUtil(this.minDate as string);
        if (!this.minDate) {
            this.currentMinDate = this.calculateYearOffset(this.now, MIN_DATE_OFFSET * -1);
        }

        this.currentMaxDate = new DateUtil(this.maxDate as string);
        if (!this.maxDate) {
            this.currentMaxDate = this.calculateYearOffset(this.now, MAX_DATE_OFFSET);
        }

        this.initCurrentlyDisplayedDate();
    }

    nextMonth(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, this.currentlyDisplayedMonth + 1, this.currentlyDisplayedDay);
    }

    previousMonth(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, this.currentlyDisplayedMonth - 1, this.currentlyDisplayedDay);
    }

    nextYear(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear + 1, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
    }

    previousYear(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear - 1, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
    }

    selectYear(year: YearState): void {
        this.updateCurrentlyDisplayedDate(year.year, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
    }

    selectMonth(month: MonthState): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, month.month, this.currentlyDisplayedDay);
    }

    get currentlyDisplayedYear(): number {
        return this.currentlyDisplayedDate.fullYear();
    }

    get currentlyDisplayedMonth(): number {
        return this.currentlyDisplayedDate.month();
    }

    get currentlyDisplayedDay(): number {
        return this.currentlyDisplayedDate.day();
    }

    get years(): YearState[] {
        let years: YearState[] = [];
        for (let year: number = this.currentMaxDate.fullYear(); year >= this.currentMinDate.fullYear(); year--) {
            years.push({ year: year, isCurrent: this.currentlyDisplayedYear === year });
        }
        return years;
    }

    get months(): MonthState[] {
        let months: MonthState[] = [];
        let date: DateUtil;
        for (let index: number = FIRST_MONTH_INDEX; index <= LAST_MONTH_INDEX; index++) {
            date = new DateUtil(this.currentlyDisplayedDate.fullYear(), index, 1);
            months.push({
                month: index,
                isCurrent: this.currentlyDisplayedMonth === index,
                isDisabled: !date.isBetweenStrict(this.currentMinDate, this.currentMaxDate, DatePrecision.MONTH)
            });
        }
        return months;
    }

    get daysOfMonth(): DayState[] {
        return this.buildDaysList();
    }


    protected abstract initCurrentDate(): void;
    protected abstract initCurrentlyDisplayedDate(): void;

    protected abstract updateCurrentlyDisplayedDate(year: number, month: number, day: number): void;

    protected overrideCalendarEvents(events: CalendarEvents): CalendarEvents {
        return events;
    }

    protected selectedDayToDate(selectedDay: DayState): DateUtil {
        return new DateUtil(selectedDay.year, selectedDay.month, selectedDay.day);
    }

    protected isDayDisabled(date: DateUtil): boolean {
        return date.isBefore(this.currentMinDate, DatePrecision.DAY) || date.isAfter(this.currentMaxDate, DatePrecision.DAY);
    }

    protected isDayToday(date: DateUtil): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    protected isInCurrentMonth(date: DateUtil): boolean {
        return date.month() === this.currentlyDisplayedMonth;
    }

    protected isDaySelected(date: DateUtil): boolean {
        return false;
    }

    protected isHighlighted(_date: DateUtil): boolean {
        return false;
    }

    protected hasFocus(date: DateUtil): boolean {
        return this.lastSelectedDate && date.isSame(this.lastSelectedDate);
    }

    private buildDaysList(): DayState[] {
        const startDate: DateUtil = this.calculateStartDate(this.currentlyDisplayedDate);
        const endDate: DateUtil = this.calculateEndDate(this.currentlyDisplayedDate);
        const numberOfDays: number = startDate.deltaInDays(endDate);

        let days: DayState[] = [];
        let date: DateUtil;
        for (let index: number = 0; index <= numberOfDays; index++) {
            date = new DateUtil(startDate.fullYear(), startDate.month(), startDate.day() + index);
            days.push({
                day: date.day(),
                month: date.month(),
                year: date.fullYear(),
                isDisabled: this.isDayDisabled(date),
                isToday: this.isDayToday(date),
                isSelected: this.isDaySelected(date),
                isInCurrentMonth: this.isInCurrentMonth(date),
                isHighlighted: this.isHighlighted(date),
                hasFocus: this.hasFocus(date)
            });
        }
        return days;
    }

    private calculateStartDate(date: DateUtil): DateUtil {
        const startOffset: number = this.weekdayIndexOfFirstDayOfMonth(date);
        return new DateUtil(date.fullYear(), date.month(), 1 - startOffset);
    }

    private calculateEndDate(date: DateUtil): DateUtil {
        const endOffset: number = LAST_DAY_OF_WEEK_INDEX - this.weekdayIndexOfLastDayOfMonth(date);
        return new DateUtil(date.fullYear(), date.month(), this.daysInMonth(date) + endOffset);
    }

    private weekdayIndexOfFirstDayOfMonth(date: DateUtil): number {
        const dateFirstOfMonth: Date = new Date(date.fullYear(), date.month(), 1);
        return dateFirstOfMonth.getDay();
    }

    private weekdayIndexOfLastDayOfMonth(date: DateUtil): number {
        const dateLastOfMonth: Date = new Date(date.fullYear(), date.month() + 1, 0);
        return dateLastOfMonth.getDay();
    }

    private daysInMonth(date: DateUtil): number {
        const dateLastOfMonth: Date = new Date(date.fullYear(), date.month() + 1, 0);
        return dateLastOfMonth.getDate();
    }

    private calculateYearOffset(date: DateUtil, offset: number): DateUtil {
        return new DateUtil(date.fullYear() + (offset), date.month(), date.day());
    }
}
