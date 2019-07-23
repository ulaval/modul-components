import ModulDate, { DatePrecision } from './../../../../utils/modul-date/modul-date';
import CalendarState, { Calendar, CalendarCurrentState, CalendarEvent, CalendarEvents, CalendarType, DaySelectCallBack, DayState, MonthState, YearMonthState, YearState } from './calendar-state';

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
    protected now: ModulDate = new ModulDate();

    protected currentlyDisplayedDate: ModulDate = new ModulDate();
    protected currentMinDate: ModulDate;
    protected currentMaxDate: ModulDate;

    protected minDate: string;
    protected maxDate: string;

    protected daySelectCallback: Function;

    private calendar: Calendar = {
        dates: { min: new ModulDate(), current: new ModulDate(), max: new ModulDate() },
        years: [],
        months: [],
        yearsMonths: [],
        days: []
    };

    private events: CalendarEvents;

    private lastSelectedDate: ModulDate;

    constructor(value?: SingleDate | RangeDate, minDate?: string, maxDate?: string) {
        this.initDates(value, minDate, maxDate);
    }

    abstract updateState(value: SingleDate | RangeDate, minDate?: string, maxDate?: string): void;

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
        this.currentlyDisplayedDate = new ModulDate(year, month, day);

        if (this.currentlyDisplayedDate.isAfter(this.currentMaxDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new ModulDate(this.currentMaxDate);
        }

        if (this.currentlyDisplayedDate.isBefore(this.currentMinDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new ModulDate(this.currentMinDate);
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

    protected selectYearMonth(year: YearState, month: MonthState): void {
        this.updateCurrentlyDisplayedDate(year.year, month.month, this.currentlyDisplayedDay());
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
        this.calendar.type = this.calendarType();
        this.calendar.yearsMonths = this.yearsMonths();
        return this.calendar;
    }

    protected assembleCalendarEvents(): CalendarEvents {
        if (!this.events) {
            this.events = {
                [CalendarEvent.DAY_SELECT]: this.selectDay.bind(this),
                [CalendarEvent.DAY_MOUSE_ENTER]: () => { },
                [CalendarEvent.DAY_MOUSE_LEAVE]: () => { },
                [CalendarEvent.DAY_KEYBOARD_TAB]: () => { },
                [CalendarEvent.MONTH_SELECT]: this.selectMonth.bind(this),
                [CalendarEvent.MONTH_PREVIOUS]: this.previousMonth.bind(this),
                [CalendarEvent.MONTH_NEXT]: this.nextMonth.bind(this),
                [CalendarEvent.YEAR_SELECT]: this.selectYear.bind(this),
                [CalendarEvent.YEAR_MONTH_SELECT]: this.selectYearMonth.bind(this),
                [CalendarEvent.YEAR_PREVIOUS]: this.previousYear.bind(this),
                [CalendarEvent.YEAR_NEXT]: this.nextYear.bind(this)
            } as CalendarEvents;

            this.events = this.overrideCalendarEvents(this.events);
        }
        return this.events;
    }

    protected abstract assembleValue(): SingleDate | RangeDate | undefined;
    protected abstract calendarType(): CalendarType;

    protected overrideCalendarEvents(events: CalendarEvents): CalendarEvents {
        return events;
    }

    protected selectedDayToDate(selectedDay: DayState): ModulDate {
        return new ModulDate(selectedDay.year, selectedDay.month, selectedDay.day);
    }

    protected isDayDisabled(date: ModulDate): boolean {
        return !date.isBetween(this.currentMinDate, this.currentMaxDate, DatePrecision.DAY);
    }

    protected isDayToday(date: ModulDate): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    protected isInPreviousMonth(date: ModulDate): boolean {
        return date.isBefore(this.currentlyDisplayedDate, DatePrecision.MONTH);
    }

    protected isInNextMonth(date: ModulDate): boolean {
        return date.isAfter(this.currentlyDisplayedDate, DatePrecision.MONTH);
    }

    protected isDaySelected(_date: ModulDate): boolean {
        return false;
    }

    protected isHighlighted(_date: ModulDate): boolean {
        return false;
    }

    protected isSelectionStart(_date: ModulDate): boolean {
        return false;
    }

    protected isSelectionEnd(_date: ModulDate): boolean {
        return false;
    }

    protected hasFocus(date: ModulDate): boolean {
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
        for (let year: number = this.currentMinDate.fullYear(); year <= this.currentMaxDate.fullYear(); year++) {
            years.push({ year: year, isCurrent: this.currentlyDisplayedYear() === year });
        }
        return years;
    }

    private months(): MonthState[] {
        let months: MonthState[] = [];
        let date: ModulDate;
        for (let index: number = FIRST_MONTH_INDEX; index <= LAST_MONTH_INDEX; index++) {
            date = new ModulDate(this.currentlyDisplayedDate.fullYear(), index, 1);
            months.push({
                month: index,
                isCurrent: this.currentlyDisplayedMonth() === index,
                isDisabled: !date.isBetween(this.currentMinDate, this.currentMaxDate, DatePrecision.MONTH)
            });
        }
        return months;
    }

    private yearsMonths(): YearMonthState[] {
        let yearsMonths: YearMonthState[] = [];
        for (let year: number = this.currentMinDate.fullYear(); year <= this.currentMaxDate.fullYear(); year++) {
            let months: MonthState[] = [];
            let date: ModulDate;
            let isYearsCurrent: boolean = this.currentlyDisplayedDate.fullYear() === year;
            let isYearMinOrMax: boolean = (year === this.currentMinDate.fullYear()) || (year === this.currentMaxDate.fullYear());
            for (let monthIndex: number = FIRST_MONTH_INDEX; monthIndex <= LAST_MONTH_INDEX; monthIndex++) {
                date = new ModulDate(year, monthIndex, 1);
                months.push({
                    month: monthIndex,
                    isCurrent: isYearsCurrent && (this.currentlyDisplayedMonth() === monthIndex),
                    isDisabled: isYearMinOrMax && !date.isBetween(this.currentMinDate, this.currentMaxDate, DatePrecision.MONTH)
                });
            }

            yearsMonths.push({
                year: { year: year, isCurrent: this.currentlyDisplayedYear() === year },
                months: months
            });
        }
        return yearsMonths;
    }

    private daysOfMonth(): DayState[] {
        return this.buildDaysList();
    }

    private initMaxDate(maxDate?: string): void {
        if (this.currentMaxDate && this.currentMaxDate.isSame(new ModulDate(maxDate))) { return; }

        if (maxDate) {
            this.currentMaxDate = new ModulDate(maxDate);
        } else {
            this.currentMaxDate = this.calculateYearOffset(this.now, MAX_DATE_OFFSET);
        }
    }

    private initMinDate(minDate?: string): void {
        if (this.currentMinDate && this.currentMinDate.isSame(new ModulDate(minDate))) { return; }

        if (minDate) {
            this.currentMinDate = new ModulDate(minDate);
        } else {
            this.currentMinDate = this.calculateYearOffset(this.now, MIN_DATE_OFFSET * -1);
        }
    }

    private buildDaysList(): DayState[] {
        const startDate: ModulDate = this.calculateStartDate(this.currentlyDisplayedDate);
        const endDate: ModulDate = this.calculateEndDate(this.currentlyDisplayedDate);
        const numberOfDays: number = startDate.deltaInDays(endDate);

        let days: DayState[] = [];
        let date: ModulDate;
        for (let index: number = 0; index <= numberOfDays; index++) {
            date = new ModulDate(startDate.fullYear(), startDate.month(), startDate.day() + index);
            days.push({
                date,
                day: date.day(),
                month: date.month(),
                year: date.fullYear(),
                isDisabled: this.isDayDisabled(date),
                isToday: this.isDayToday(date),
                isSelected: this.isDaySelected(date),
                isSelectionStart: this.isSelectionStart(date),
                isSelectionEnd: this.isSelectionEnd(date),
                isInPreviousMonth: this.isInPreviousMonth(date),
                isInNextMonth: this.isInNextMonth(date),
                isHighlighted: this.isHighlighted(date),
                hasFocus: this.hasFocus(date)
            });
        }
        return days;
    }

    private calculateStartDate(date: ModulDate): ModulDate {
        const startOffset: number = this.weekdayIndexOfFirstDayOfMonth(date);
        return new ModulDate(date.fullYear(), date.month(), 1 - startOffset);
    }

    private calculateEndDate(date: ModulDate): ModulDate {
        const endOffset: number = LAST_DAY_OF_WEEK_INDEX - this.weekdayIndexOfLastDayOfMonth(date);
        return new ModulDate(date.fullYear(), date.month(), this.daysInMonth(date) + endOffset);
    }

    private weekdayIndexOfFirstDayOfMonth(date: ModulDate): number {
        const dateFirstOfMonth: Date = new Date(date.fullYear(), date.month(), 1);
        return dateFirstOfMonth.getDay();
    }

    private weekdayIndexOfLastDayOfMonth(date: ModulDate): number {
        const dateLastOfMonth: Date = new Date(date.fullYear(), date.month() + 1, 0);
        return dateLastOfMonth.getDay();
    }

    private daysInMonth(date: ModulDate): number {
        const dateLastOfMonth: Date = new Date(date.fullYear(), date.month() + 1, 0);
        return dateLastOfMonth.getDate();
    }

    private calculateYearOffset(date: ModulDate, offset: number): ModulDate {
        return new ModulDate(date.fullYear() + (offset), date.month(), date.day());
    }
}
