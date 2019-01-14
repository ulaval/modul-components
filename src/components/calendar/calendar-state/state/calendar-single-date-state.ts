import DateUtil, { DatePrecision } from '../../../../utils/date-util/date-util';
import AbstractCalendarState, { SingleDate } from './abstract-calendar-state';

export default class CalendarSingleDateState extends AbstractCalendarState {

    private currentDate: DateUtil;

    selectDay(selectedDay: any): void {
        super.selectDay(selectedDay);
        if (!selectedDay.isDisabled) {
            const newDate: DateUtil = this.selectedDayToDate(selectedDay);
            this.currentDate = newDate;
            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());

            this.daySelectCallback(this.currentDate.toString());
        }
    }

    updateValue(value: SingleDate): void {
        this.initDates(value);
    }

    protected initCurrentValue(value: SingleDate): void {
        if (value) {
            this.currentDate = new DateUtil(value as string);
        }
    }

    protected initCurrentlyDisplayedDate(): void {
        if (this.currentDate) {
            this.updateCurrentlyDisplayedDate(this.currentDate.fullYear(), this.currentDate.month(), this.now.day());
        } else {
            this.updateCurrentlyDisplayedDate(this.now.fullYear(), this.now.month(), this.now.day());
        }
    }

    protected isDayDisabled(date: DateUtil): boolean {
        return !date.isBetween(this.currentMinDate, this.currentMaxDate, DatePrecision.DAY);
    }

    protected isDayToday(date: DateUtil): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    protected isDaySelected(date: DateUtil): boolean {
        return !!this.currentDate && date.isSame(this.currentDate, DatePrecision.DAY);
    }

    protected isInCurrentMonth(date: DateUtil): boolean {
        return date.month() === this.currentlyDisplayedMonth();
    }
}
