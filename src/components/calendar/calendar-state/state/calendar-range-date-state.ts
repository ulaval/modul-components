import DateUtil, { DatePrecision } from '../../../../utils/date-util/date-util';
import AbstractCalendarState, { RangeDate } from './abstract-calendar-state';
import { CalendarEvent, CalendarEvents, DayState } from './calendar-state';

enum DateRangePosition {
    BEGIN = 'begin',
    END = 'end'
}

interface InnerModel {
    begin: DateUtil | undefined;
    end: DateUtil | undefined;
}

export default class CalendarRangeDateState extends AbstractCalendarState {

    private currentRange: InnerModel;
    private currentDateHiglighted: DateUtil = new DateUtil();

    updateValue(value: RangeDate): void {
        this.initDates(value);
    }

    protected assembleValue(): RangeDate {
        return {
            begin: this.currentRange.begin ? this.currentRange.begin.toString() : '',
            end: this.currentRange.end ? this.currentRange.end.toString() : ''
        };
    }

    protected selectDay(selectedDay: DayState): void {
        super.selectDay(selectedDay);
        if (!selectedDay.isDisabled) {
            const newDate: DateUtil = this.selectedDayToDate(selectedDay);
            this.currentRange = this.updateRangeModel(this.currentRange as InnerModel, newDate);
            this.currentRange = this.reOrderRangeDates(this.currentRange);

            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());

            this.emitUpdate(this.assembleValue());
        }
    }

    protected highlightDate(selectedDay: DayState): void {
        this.currentDateHiglighted = this.selectedDayToDate(selectedDay);
    }

    protected overrideCalendarEvents(events: CalendarEvents): CalendarEvents {
        events[CalendarEvent.DAY_MOUSE_ENTER] = this.highlightDate.bind(this);
        return events;
    }

    protected initCurrentValue(value: RangeDate): void {
        const rangeCache: InnerModel = Object.assign({}, this.currentRange);
        if (value) {
            this.currentRange = {
                begin: this.initDateRange(value as RangeDate, DateRangePosition.BEGIN),
                end: this.initDateRange(value as RangeDate, DateRangePosition.END)
            };

            if (this.currentRange.begin) {
                this.currentDateHiglighted = new DateUtil(this.currentRange.begin);
            } else if (this.currentRange.end) {
                this.currentDateHiglighted = new DateUtil(this.currentRange.end);
            }
        } else {
            this.currentRange = { begin: undefined, end: undefined };
        }
    }

    protected initCurrentlyDisplayedDate(): void {
        if (this.currentRange.begin) {
            this.updateCurrentlyDisplayedDate(this.currentRange.begin.fullYear(), this.currentRange.begin.month(), this.currentRange.begin.day());
        } else if (this.currentRange.end) {
            this.updateCurrentlyDisplayedDate(this.currentRange.end.fullYear(), this.currentRange.end.month(), this.currentRange.end.day());
        } else {
            this.updateCurrentlyDisplayedDate(this.now.fullYear(), this.now.month(), this.now.day());
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

    private betweenBeginAndHightlight(date: DateUtil): boolean {
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
            range.end = [range.begin, range.begin = range.end][0];
        }
        return range;
    }


}
