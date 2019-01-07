import { Component, Prop, Watch } from 'vue-property-decorator';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import { CalendarRange } from '../calendar';
import { CalendarEvent } from '../calendar-renderer/abstract-calendar-renderer';
import { Calendar, CalendarEvents, MAbstractCalendarState, RangeDate } from './abstract-calendar-state';

enum DateRangePosition {
    BEGIN = 'begin',
    END = 'end'
}

interface InnerModel {
    begin: DateUtil | undefined;
    end: DateUtil | undefined;
}

@Component
export class MCalendarRangeDateState extends MAbstractCalendarState {

    @Prop()
    value: RangeDate;

    private currentDate: InnerModel;

    private currentDateHiglighted: DateUtil = new DateUtil();

    private calendar: Calendar = {
        dates: { min: new DateUtil(), current: new DateUtil(), max: new DateUtil() },
        years: [],
        months: [],
        days: []
    };

    @Watch('value')
    refreshValue(): void {
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
        return {
            [CalendarEvent.DATE_SELECT]: this.selectDate,
            [CalendarEvent.DATE_MOUSE_ENTER]: this.highlightDate,
            [CalendarEvent.DATE_MOUSE_LEAVE]: () => { },
            [CalendarEvent.MONTH_SELECT]: this.selectMonth,
            [CalendarEvent.MONTH_PREVIOUS]: this.previousMonth,
            [CalendarEvent.MONTH_NEXT]: this.nextMonth,
            [CalendarEvent.YEAR_SELECT]: this.selectYear,
            [CalendarEvent.YEAR_PREVIOUS]: this.previousYear,
            [CalendarEvent.YEAR_NEXT]: this.nextYear
        };
    }

    selectDate(selectedDate: any): void {
        if (!selectedDate.isDisabled) {
            const newDate: DateUtil = new DateUtil(selectedDate.year, selectedDate.month, selectedDate.day);
            this.currentDate = this.updateRangeModel(this.currentDate as InnerModel, newDate);
            this.currentDate = this.reOrderRangeDates(this.currentDate);

            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());

            this.$emit('input', {
                begin: this.currentDate.begin ? this.currentDate.begin.toISO().split('T')[0] : '',
                end: this.currentDate.end ? this.currentDate.end.toISO().split('T')[0] : ''
            });
        }
    }

    highlightDate(selectedDate: any): void {
        this.currentDateHiglighted = new DateUtil(selectedDate.year, selectedDate.month, selectedDate.day);
    }

    protected initCurrentDate(): void {
        if (this.value) {
            this.currentDate = {
                begin: this.initDateRange(this.value as CalendarRange, DateRangePosition.BEGIN),
                end: this.initDateRange(this.value as CalendarRange, DateRangePosition.END)
            };

            if (this.currentDate.begin) {
                this.currentDateHiglighted = new DateUtil(this.currentDate.begin);
            } else if (this.currentDate.end) {
                this.currentDateHiglighted = new DateUtil(this.currentDate.end);
            }
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

    protected isDaySelected(date: DateUtil): boolean {
        return ((this.currentDate.begin && this.currentDate.end) && date.isBetween(this.currentDate.begin, this.currentDate.end, DatePrecision.DAY))
            || (!!this.currentDate.begin && date.isSame(this.currentDate.begin, DatePrecision.DAY))
            || (!!this.currentDate.end && date.isSame(this.currentDate.end, DatePrecision.DAY));
    }

    protected isHighlighted(date: DateUtil): boolean {
        return (!!this.currentDate.begin && !this.currentDate.end) && this.betweenBeginAndHightlight(date);
    }

    private betweenBeginAndHightlight(date): boolean {
        if (this.currentDate.begin) {
            if (this.currentDateHiglighted.isBefore(this.currentDate.begin)) {
                return date.isBetween(this.currentDateHiglighted, this.currentDate.begin, DatePrecision.DAY);
            } else {
                return date.isBetween(this.currentDate.begin, this.currentDateHiglighted, DatePrecision.DAY);
            }
        }
        return false;
    }

    private initDateRange(dates: CalendarRange, position: DateRangePosition): DateUtil | undefined {
        return (dates[position]) ? new DateUtil(dates[position]) : undefined;
    }

    private updateRangeModel(range: InnerModel, date: DateUtil): InnerModel {
        if (range.end) {
            range.end = undefined;
            range.begin = date;
        } else if (range.begin) {
            range.end = date;
        } else {
            range.begin = date;
        }
        return range;
    }

    private reOrderRangeDates(range: InnerModel): InnerModel {
        if (range.begin
            && range.end
            && range.end.isBefore(range.begin, DatePrecision.DAY)
        ) {
            const temp: DateUtil = range.begin;
            range.begin = range.end;
            range.end = temp;
        }
        return range;
    }


}
