import ModulDate, { DatePrecision } from './../../../../utils/modul-date/modul-date';
import AbstractCalendarState, { SingleDate } from './abstract-calendar-state';
import { CalendarType, MonthState, YearState } from './calendar-state';

export default class CalendarSingleDateState extends AbstractCalendarState {

    private currentDate: ModulDate | undefined;

    updateState(value: SingleDate, minDate?: string, maxDate?: string): void {
        this.initDates(value, minDate, maxDate);
    }

    protected assembleValue(): SingleDate {
        return this.currentDate ? this.currentDate.toString() : '';
    }

    protected selectYearMonth(year: YearState, month: MonthState): void {
        this.currentDate = new ModulDate(year.year, month.month, 1);
        this.emitUpdate(this.assembleValue());

        super.selectYearMonth(year, month);
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
        } else {
            this.currentDate = undefined;
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

    protected isSelectionStart(date: ModulDate): boolean {
        return this.isDaySelected(date);
    }

    protected isSelectionEnd(date: ModulDate): boolean {
        return this.isDaySelected(date);
    }

    protected calendarType(): CalendarType {
        return CalendarType.SINGLE_DATE;
    }
}
