import ModulDate, { DatePrecision } from './../../../../utils/modul-date/modul-date';
import AbstractCalendarState, { RangeDate } from './abstract-calendar-state';
import { CalendarEvent, CalendarEvents, CalendarType, DayState } from './calendar-state';

enum DateRangePosition {
    BEGIN = 'begin',
    END = 'end'
}

interface InnerModel {
    begin: ModulDate | undefined;
    end: ModulDate | undefined;
}

export default class CalendarRangeDateState extends AbstractCalendarState {

    private currentRange: InnerModel;
    private currentDateHiglighted: ModulDate = new ModulDate();

    updateState(value: RangeDate, minDate?: string, maxDate?: string): void {
        this.initDates(value, minDate, maxDate);
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
            const newDate: ModulDate = this.selectedDayToDate(selectedDay);
            this.currentRange = this.updateRangeModel(this.currentRange, newDate);
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
        events[CalendarEvent.DAY_KEYBOARD_TAB] = this.highlightDate.bind(this);
        return events;
    }

    protected initCurrentValue(value: RangeDate): void {
        const rangeCache: InnerModel = Object.assign({}, this.currentRange);
        if (value) {
            this.currentRange = {
                begin: this.initDateRange(value, DateRangePosition.BEGIN),
                end: this.initDateRange(value, DateRangePosition.END)
            };

            if (this.currentRange.begin) {
                this.currentDateHiglighted = new ModulDate(this.currentRange.begin);
            } else if (this.currentRange.end) {
                this.currentDateHiglighted = new ModulDate(this.currentRange.end);
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

    protected isDaySelected(date: ModulDate): boolean {
        return (!!this.currentRange.begin && date.isSame(this.currentRange.begin, DatePrecision.DAY))
            || (!!this.currentRange.end && date.isSame(this.currentRange.end, DatePrecision.DAY));
    }

    protected isHighlighted(date: ModulDate): boolean {
        return ((!!this.currentRange.begin && !this.currentRange.end) && this.betweenBeginAndHightlight(date))
            || ((!!this.currentRange.begin && !!this.currentRange.end) && date.isBetween(this.currentRange.begin, this.currentRange.end, DatePrecision.DAY));
    }

    protected isSelectionStart(date: ModulDate): boolean {
        return (!!this.currentRange.begin && date.isSame(this.currentRange.begin, DatePrecision.DAY));
    }

    protected isSelectionEnd(date: ModulDate): boolean {
        return (!!this.currentRange.end && date.isSame(this.currentRange.end, DatePrecision.DAY));
    }

    protected calendarType(): CalendarType {
        return CalendarType.DATE_RANGE;
    }

    private betweenBeginAndHightlight(date: ModulDate): boolean {
        if (this.currentRange.begin) {
            if (this.currentDateHiglighted.isBefore(this.currentRange.begin)) {
                return date.isBetween(this.currentDateHiglighted, this.currentRange.begin, DatePrecision.DAY);
            } else {
                return date.isBetween(this.currentRange.begin, this.currentDateHiglighted, DatePrecision.DAY);
            }
        }
        return false;
    }

    private initDateRange(dates: RangeDate, position: DateRangePosition): ModulDate | undefined {
        return (dates[position]) ? new ModulDate(dates[position]) : undefined;
    }

    private updateRangeModel(range: InnerModel, date: ModulDate): InnerModel {
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
