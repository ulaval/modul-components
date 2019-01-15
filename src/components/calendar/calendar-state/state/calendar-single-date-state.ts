import DateUtil, { DatePrecision } from '../../../../utils/date-util/date-util';
import AbstractCalendarState, { SingleDate } from './abstract-calendar-state';

export default class CalendarSingleDateState extends AbstractCalendarState {

    private currentDate: DateUtil;

    updateValue(value: SingleDate): void {
        this.initDates(value);
    }

    protected assembleValue(): SingleDate {
        return this.currentDate ? this.currentDate.toString() : '';
    }

    protected selectDay(selectedDay: any): void {
        super.selectDay(selectedDay);
        if (!selectedDay.isDisabled) {
            const newDate: DateUtil = this.selectedDayToDate(selectedDay);
            this.currentDate = newDate;
            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());

            this.emitUpdate(this.assembleValue());
        }
    }

    protected initCurrentValue(value: SingleDate): void {
        if (value) {
            this.currentDate = new DateUtil(value);
        }
    }

    protected initCurrentlyDisplayedDate(): void {
        if (this.currentDate) {
            this.updateCurrentlyDisplayedDate(this.currentDate.fullYear(), this.currentDate.month(), this.currentDate.day());
        } else {
            this.updateCurrentlyDisplayedDate(this.now.fullYear(), this.now.month(), this.now.day());
        }
    }

    protected isDaySelected(date: DateUtil): boolean {
        return !!this.currentDate && date.isSame(this.currentDate, DatePrecision.DAY);
    }
}
