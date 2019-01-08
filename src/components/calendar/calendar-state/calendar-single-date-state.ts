import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import { MAbstractCalendarState, SingleDate } from './abstract-calendar-state';

@Component
export class MCalendarSingleDateState extends MAbstractCalendarState {

    @Prop()
    value: SingleDate;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    private currentDate: DateUtil;

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

    selectDay(selectedDay: any): void {
        super.selectDay(selectedDay);
        if (!selectedDay.isDisabled) {
            const newDate: DateUtil = this.selectedDayToDate(selectedDay);
            this.currentDate = newDate;
            this.updateCurrentlyDisplayedDate(newDate.fullYear(), newDate.month(), newDate.day());
            this.$emit('input', this.currentDate.toString().split('T')[0]);
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
        return !date.isBetween(this.currentMinDate, this.currentMaxDate, DatePrecision.DAY);
    }

    protected isDayToday(date: DateUtil): boolean {
        return date.isSame(this.now, DatePrecision.DAY);
    }

    protected isDaySelected(date: DateUtil): boolean {
        return !!this.currentDate && date.isSame(this.currentDate, DatePrecision.DAY);
    }

    protected isInCurrentMonth(date: DateUtil): boolean {
        return date.month() === this.currentlyDisplayedMonth;
    }
}
