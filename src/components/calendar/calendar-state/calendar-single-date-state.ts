import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import { CalendarEvent } from '../calendar-renderer/abstract-calendar-renderer';
import { Calendar, CalendarEvents, DayState, MAbstractCalendarState, MonthState, YearState } from './abstract-calendar-state';

const MAX_DATE_OFFSET: number = 10;
const MIN_DATE_OFFSET: number = 10;

const FIRST_MONTH_INDEX: number = 0;
const LAST_MONTH_INDEX: number = 11;

const LAST_DAY_OF_WEEK_INDEX: number = 6;


@Component
export class MCalendarSingleDateState extends MAbstractCalendarState {

    @Prop()
    value: string;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    private currentDate: DateUtil;

    private now: DateUtil = new DateUtil();

    private currentlyDisplayedDate: DateUtil = new DateUtil();
    private currentMinDate: DateUtil = new DateUtil();
    private currentMaxDate: DateUtil = new DateUtil();

    private calendar: Calendar = {
        dates: { min: new DateUtil(), current: new DateUtil(), max: new DateUtil() },
        years: [],
        months: [],
        days: []
    };

    render(): any {
        return super.render();
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
        return {
            [CalendarEvent.DATE_SELECT]: this.selectDate,
            [CalendarEvent.DATE_MOUSE_ENTER]: () => { },
            [CalendarEvent.DATE_MOUSE_LEAVE]: () => { },
            [CalendarEvent.MONTH_SELECT]: this.selectMonth,
            [CalendarEvent.MONTH_PREVIOUS]: this.previousMonth,
            [CalendarEvent.MONTH_NEXT]: this.nextMonth,
            [CalendarEvent.YEAR_SELECT]: this.selectYear,
            [CalendarEvent.YEAR_PREVIOUS]: this.previousYear,
            [CalendarEvent.YEAR_NEXT]: this.nextYear
        };
    }

    created(): void {
        this.initDates();
    }

    @Watch('value')
    refreshValue(): void {
        this.initDates();
    }

    initDates(): void {
        if (this.value) {
            this.currentDate = new DateUtil(this.value as string);
        }

        this.currentMinDate = new DateUtil(this.minDate as string);
        if (!this.minDate) {
            this.currentMinDate = this.calculateYearOffset(this.now, MIN_DATE_OFFSET * -1);
        }

        this.currentMaxDate = new DateUtil(this.maxDate as string);
        if (!this.maxDate) {
            this.currentMaxDate = this.calculateYearOffset(this.now, MAX_DATE_OFFSET);
        }

        if (!this.currentDate) {
            this.updateCurrentlyDisplayedDate(this.now.fullYear(), this.now.month(), this.now.day());
        }
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

    selectYear(year: any): void {
        this.updateCurrentlyDisplayedDate(year, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
    }

    selectMonth(month: any): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, month, this.currentlyDisplayedDay);
    }

    selectDate(selectedDate: any): void {
        if (!selectedDate.isDisabled) {
            const newDate: DateUtil = new DateUtil(selectedDate.year, selectedDate.month, selectedDate.day);
            this.currentDate = newDate;
            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());
            this.$emit('input', this.currentDate.toISO().split('T')[0]);
        }
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
                isDisabled: date.isBetweenStrict(this.currentMinDate, this.currentMaxDate, DatePrecision.MONTH)
            });
        }
        return months;
    }

    get daysOfMonth(): DayState[] {
        return this.buildDaysList();
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

    /**
     * Updates the date used to display the calendar. If it's lower than the minimum date authorized, it's set to the minimum.
     * If it's higher than the maximum date authorized, it's set to the maximum
     *
     * @param year new value
     * @param month new value
     * @param day new value
     */
    private updateCurrentlyDisplayedDate(year: number, month: number, day: number): void {
        this.currentlyDisplayedDate = new DateUtil(year, month, day);

        if (this.currentlyDisplayedDate.isAfter(this.currentMaxDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new DateUtil(this.currentMaxDate);
        }

        if (this.currentlyDisplayedDate.isBefore(this.currentMinDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new DateUtil(this.currentMinDate);
        }
        this.assembleCalendar();
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
                isHover: false
            });
        }
        return days;
    }

    private isDayDisabled(date: DateUtil): boolean {
        return date.isBefore(this.currentMinDate, DatePrecision.DAY) || date.isAfter(this.currentMaxDate, DatePrecision.DAY);
    }

    private isDayToday(date: DateUtil): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    private isDaySelected(date: DateUtil): boolean {
        return date.isSame(this.currentDate, DatePrecision.DAY);
    }

    private isInCurrentMonth(date: DateUtil): boolean {
        return date.month() === this.currentlyDisplayedMonth;
    }

    private calculateStartDate(date: DateUtil): DateUtil {
        const startOffset: number = this.weekdayIndexOfFirstDayOfMonth(date);
        return new DateUtil(date.fullYear(), date.month(), 1 - startOffset);
    }

    private calculateEndDate(date: DateUtil): DateUtil {
        const endOffset: number = LAST_DAY_OF_WEEK_INDEX - this.weekdayIndexOfLastDayOfMonth(date);
        return new DateUtil(date.fullYear(), date.month(), this.daysInMonth(date) + endOffset);
    }
}
