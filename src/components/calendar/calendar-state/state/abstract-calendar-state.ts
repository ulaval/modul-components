import DateUtil, { DatePrecision } from '../../../../utils/date-util/date-util';
import CalendarState, { Calendar, CalendarCurrentState, CalendarEvent, CalendarEvents, DaySelectCallBack, DayState, MonthState, YearState } from './calendar-state';

export const MAX_DATE_OFFSET: number = 10;
export const MIN_DATE_OFFSET: number = 10;

export const FIRST_MONTH_INDEX: number = 0;
export const LAST_MONTH_INDEX: number = 11;

export const LAST_DAY_OF_WEEK_INDEX: number = 6;

export type SingleDate = string;
export interface RangeDate {
    begin?: string;
    end?: string;
}

export default abstract class AbstractCalendarState implements CalendarState {

    protected now: DateUtil = new DateUtil();

    protected currentlyDisplayedDate: DateUtil = new DateUtil();
    protected currentMinDate: DateUtil;
    protected currentMaxDate: DateUtil;

    protected minDate: string;
    protected maxDate: string;

    protected daySelectCallback: Function;

    private calendar: Calendar = {
        dates: { min: new DateUtil(), current: new DateUtil(), max: new DateUtil() },
        years: [],
        months: [],
        days: []
    };

    private events: CalendarEvents;

    private lastSelectedDate: DateUtil;

    constructor(value?: SingleDate | RangeDate, minDate?: string, maxDate?: string) {
        this.initDates(value, minDate, maxDate);
    }

    abstract updateValue(value: SingleDate | RangeDate): void;

    buildCurrentCalendar(): CalendarCurrentState {
        return {
            calendar: this.assembleCalendar(),
            calendarEvents: this.assembleCalendarEvents()
        };
    }

    onDateSelect(callback: DaySelectCallBack): void {
        this.daySelectCallback = callback;
    }

    protected abstract initCurrentValue(value?: SingleDate | RangeDate): void;
    protected abstract initCurrentlyDisplayedDate(): void;

    protected emitUpdate(data: SingleDate | RangeDate): void {
        if (this.daySelectCallback) {
            this.daySelectCallback(data);
        }
    }

    /**
     * Updates the date used to display the calendar. If it's lower than the minimum date authorized, it's set to the minimum.
     * If it's higher than the maximum date authorized, it's set to the maximum
     *
     * @param year new value
     * @param month new value
     * @param day new value
     */
    protected updateCurrentlyDisplayedDate(year: number, month: number, day: number): void {
        this.currentlyDisplayedDate = new DateUtil(year, month, day);

        if (this.currentlyDisplayedDate.isAfter(this.currentMaxDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new DateUtil(this.currentMaxDate);
        }

        if (this.currentlyDisplayedDate.isBefore(this.currentMinDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new DateUtil(this.currentMinDate);
        }
    }

    protected selectDay(selectedDay: DayState): void {
        this.lastSelectedDate = this.selectedDayToDate(selectedDay);
    }

    protected nextMonth(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear(), this.currentlyDisplayedMonth() + 1, this.currentlyDisplayedDay());
    }

    protected previousMonth(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear(), this.currentlyDisplayedMonth() - 1, this.currentlyDisplayedDay());
    }

    protected nextYear(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear() + 1, this.currentlyDisplayedMonth(), this.currentlyDisplayedDay());
    }

    protected previousYear(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear() - 1, this.currentlyDisplayedMonth(), this.currentlyDisplayedDay());
    }

    protected selectYear(year: YearState): void {
        this.updateCurrentlyDisplayedDate(year.year, this.currentlyDisplayedMonth(), this.currentlyDisplayedDay());
    }

    protected selectMonth(month: MonthState): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear(), month.month, this.currentlyDisplayedDay());
    }

    protected initDates(value?: SingleDate | RangeDate, minDate?: string, maxDate?: string): void {
        this.initCurrentValue(value);
        this.initMinDate(minDate);
        this.initMaxDate(maxDate);
        this.initCurrentlyDisplayedDate();
    }

    protected assembleCalendar(): Calendar {
        this.calendar.value = this.assembleValue();
        this.calendar.dates = {
            min: this.currentMinDate,
            current: this.currentlyDisplayedDate,
            max: this.currentMaxDate
        };
        this.calendar.years = this.years();
        this.calendar.months = this.months();
        this.calendar.days = this.daysOfMonth();
        return this.calendar;
    }

    protected assembleCalendarEvents(): CalendarEvents {
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
            } as CalendarEvents;

            this.events = this.overrideCalendarEvents(this.events);
        }
        return this.events;
    }

    protected abstract assembleValue(): SingleDate | RangeDate | undefined;

    protected overrideCalendarEvents(events: CalendarEvents): CalendarEvents {
        return events;
    }

    protected selectedDayToDate(selectedDay: DayState): DateUtil {
        return new DateUtil(selectedDay.year, selectedDay.month, selectedDay.day);
    }

    protected isDayDisabled(date: DateUtil): boolean {
        return !date.isBetween(this.currentMinDate, this.currentMaxDate, DatePrecision.DAY);
    }

    protected isDayToday(date: DateUtil): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    protected isInPreviousMonth(date: DateUtil): boolean {
        return date.isBefore(this.currentlyDisplayedDate, DatePrecision.MONTH);
    }

    protected isInNextMonth(date: DateUtil): boolean {
        return date.isAfter(this.currentlyDisplayedDate, DatePrecision.MONTH);
    }

    protected isDaySelected(_date: DateUtil): boolean {
        return false;
    }

    protected isHighlighted(_date: DateUtil): boolean {
        return false;
    }

    protected hasFocus(date: DateUtil): boolean {
        return !!this.lastSelectedDate && date.isSame(this.lastSelectedDate);
    }

    protected currentlyDisplayedYear(): number {
        return this.currentlyDisplayedDate.fullYear();
    }

    protected currentlyDisplayedMonth(): number {
        return this.currentlyDisplayedDate.month();
    }

    protected currentlyDisplayedDay(): number {
        return this.currentlyDisplayedDate.day();
    }

    private years(): YearState[] {
        let years: YearState[] = [];
        for (let year: number = this.currentMaxDate.fullYear(); year >= this.currentMinDate.fullYear(); year--) {
            years.push({ year: year, isCurrent: this.currentlyDisplayedYear() === year });
        }
        return years;
    }

    private months(): MonthState[] {
        let months: MonthState[] = [];
        let date: DateUtil;
        for (let index: number = FIRST_MONTH_INDEX; index <= LAST_MONTH_INDEX; index++) {
            date = new DateUtil(this.currentlyDisplayedDate.fullYear(), index, 1);
            months.push({
                month: index,
                isCurrent: this.currentlyDisplayedMonth() === index,
                isDisabled: !date.isBetweenStrict(this.currentMinDate, this.currentMaxDate, DatePrecision.MONTH)
            });
        }
        return months;
    }

    private daysOfMonth(): DayState[] {
        return this.buildDaysList();
    }

    private initMaxDate(maxDate?: string): void {
        if (this.currentMaxDate) { return; }

        if (maxDate) {
            this.currentMaxDate = new DateUtil(maxDate);
        } else {
            this.currentMaxDate = this.calculateYearOffset(this.now, MAX_DATE_OFFSET);
        }
    }

    private initMinDate(minDate?: string): void {
        if (this.currentMinDate) { return; }

        if (minDate) {
            this.currentMinDate = new DateUtil(minDate);
        } else {
            this.currentMinDate = this.calculateYearOffset(this.now, MIN_DATE_OFFSET * -1);
        }
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
                isInPreviousMonth: this.isInPreviousMonth(date),
                isInNextMonth: this.isInNextMonth(date),
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
