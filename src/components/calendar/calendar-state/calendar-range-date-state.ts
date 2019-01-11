import { Component, Prop, Watch } from 'vue-property-decorator';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import { CalendarEvent } from '../calendar-renderer/abstract-calendar-renderer';
import { CalendarEvents, DayState, MAbstractCalendarState, RangeDate } from './abstract-calendar-state';

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

    private currentRange: InnerModel;

    private currentDateHiglighted: DateUtil = new DateUtil();

    @Watch('value')
    refreshValue(): void {
        super.refreshValue();
    }

    created(): void {
        super.created();
    }

    render(): any {
        return super.render();
    }

    selectDay(selectedDay: DayState): void {
        super.selectDay(selectedDay);
        if (!selectedDay.isDisabled) {
            const newDate: DateUtil = this.selectedDayToDate(selectedDay);
            this.currentRange = this.updateRangeModel(this.currentRange as InnerModel, newDate);
            this.currentRange = this.reOrderRangeDates(this.currentRange);

            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());

            this.$emit('input', {
                begin: this.currentRange.begin ? this.currentRange.begin.toString() : '',
                end: this.currentRange.end ? this.currentRange.end.toString() : ''
            });
        }
    }

    highlightDate(selectedDay: DayState): void {
        this.currentDateHiglighted = this.selectedDayToDate(selectedDay);
    }

    protected overrideCalendarEvents(events: CalendarEvents): CalendarEvents {
        events[CalendarEvent.DAY_MOUSE_ENTER] = this.highlightDate;
        return events;
    }

    protected initCurrentDate(): void {
        if (this.value) {
            this.currentRange = {
                begin: this.initDateRange(this.value as RangeDate, DateRangePosition.BEGIN),
                end: this.initDateRange(this.value as RangeDate, DateRangePosition.END)
            };

            if (this.currentRange.begin) {
                this.currentDateHiglighted = new DateUtil(this.currentRange.begin);
            } else if (this.currentRange.end) {
                this.currentDateHiglighted = new DateUtil(this.currentRange.end);
            }
        }
    }

    protected initCurrentlyDisplayedDate(): void {
        if (!this.currentRange) {
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
        return ((this.currentRange.begin && this.currentRange.end) && date.isBetween(this.currentRange.begin, this.currentRange.end, DatePrecision.DAY))
            || (!!this.currentRange.begin && date.isSame(this.currentRange.begin, DatePrecision.DAY))
            || (!!this.currentRange.end && date.isSame(this.currentRange.end, DatePrecision.DAY));
    }

    protected isHighlighted(date: DateUtil): boolean {
        return (!!this.currentRange.begin && !this.currentRange.end) && this.betweenBeginAndHightlight(date);
    }

    private betweenBeginAndHightlight(date): boolean {
        if (this.currentRange.begin) {
            if (this.currentDateHiglighted.isBefore(this.currentRange.begin)) {
                return date.isBetween(this.currentDateHiglighted, this.currentRange.begin, DatePrecision.DAY);
            } else {
                return date.isBetween(this.currentRange.begin, this.currentDateHiglighted, DatePrecision.DAY);
            }
        }
        return false;
    }

    private initDateRange(dates: RangeDate, position: DateRangePosition): DateUtil | undefined {
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
