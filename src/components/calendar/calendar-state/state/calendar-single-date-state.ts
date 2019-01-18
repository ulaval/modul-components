import ModulDate, { DatePrecision } from './../../../../utils/modul-date/modul-date';
import AbstractCalendarState, { SingleDate } from './abstract-calendar-state';

export default class CalendarSingleDateState extends AbstractCalendarState {

    private currentDate: ModulDate;

    updateValue(value: SingleDate): void {
        this.initDates(value);
    }

    protected assembleValue(): SingleDate {
        return this.currentDate ? this.currentDate.toString() : '';
    }

    protected selectDay(selectedDay: any): void {
        super.selectDay(selectedDay);
        if (!selectedDay.isDisabled) {
            const newDate: ModulDate = this.selectedDayToDate(selectedDay);
            this.currentDate = newDate;
            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());

            this.emitUpdate(this.assembleValue());
        }
    }

    protected initCurrentValue(value: SingleDate): void {
        if (value) {
            this.currentDate = new ModulDate(value);
        }
    }

    protected initCurrentlyDisplayedDate(): void {
        if (this.currentDate) {
            this.updateCurrentlyDisplayedDate(this.currentDate.fullYear(), this.currentDate.month(), this.currentDate.day());
        } else {
            this.updateCurrentlyDisplayedDate(this.now.fullYear(), this.now.month(), this.now.day());
        }
    }

    protected isDaySelected(date: ModulDate): boolean {
        return !!this.currentDate && date.isSame(this.currentDate, DatePrecision.DAY);
    }
}