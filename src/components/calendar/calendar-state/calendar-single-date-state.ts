import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import { CalendarEvent } from '../calendar-renderer/abstract-calendar-renderer';
import { Calendar, CalendarEvents, MAbstractCalendarState, SingleDate } from './abstract-calendar-state';

@Component
export class MCalendarSingleDateState extends MAbstractCalendarState {

    @Prop()
    value: SingleDate;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    private currentDate: DateUtil;

    private calendar: Calendar = {
        dates: { min: new DateUtil(), current: new DateUtil(), max: new DateUtil() },
        years: [],
        months: [],
        days: []
    };

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

    selectDate(selectedDate: any): void {
        if (!selectedDate.isDisabled) {
            const newDate: DateUtil = new DateUtil(selectedDate.year, selectedDate.month, selectedDate.day);
            this.currentDate = newDate;
            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());
            this.$emit('input', this.currentDate.toISO().split('T')[0]);
        }
    }

    protected initCurrentDate(): void {
        if (this.value) {
            this.currentDate = new DateUtil(this.value as string);
        }
    }

    protected initCurrentlyDisplayedDate(): void {
        if (!this.currentDate) {
            this.updateCurrentlyDisplayedDate(this.now.fullYear(), this.now.month(), this.now.day());
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

    protected isDayDisabled(date: DateUtil): boolean {
        return date.isBefore(this.currentMinDate, DatePrecision.DAY) || date.isAfter(this.currentMaxDate, DatePrecision.DAY);
    }

    protected isDayToday(date: DateUtil): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    protected isDaySelected(date: DateUtil): boolean {
        return date.isSame(this.currentDate, DatePrecision.DAY);
    }

    protected isInCurrentMonth(date: DateUtil): boolean {
        return date.month() === this.currentlyDisplayedMonth;
    }
}
