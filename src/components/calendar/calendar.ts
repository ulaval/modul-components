import Vue, { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { CALENDAR_NAME } from '../component-names';
import MediaQueriesPlugin from './../../utils/media-queries/media-queries';
import { ModulVue } from './../../utils/vue/vue';
import WithRender from './calendar.html?style=./calendar.scss';

const MAX_DATE_OFFSET: number = 10;
const MIN_DATE_OFFSET: number = 10;

const FIRST_MONTH_INDEX: number = 0;
const LAST_MONTH_INDEX: number = 11;

const LAST_DAY_OF_WEEK_INDEX: number = 6;

const NB_YEARS_PER_ROW: number = 5;
const ITEM_DIMENSION: number = 40;

const TRANSLATION_ROOT: string = CALENDAR_NAME + ':';
const TRANSLATION_MONTHS: string = TRANSLATION_ROOT + 'month';
const TRANSLATION_WEEKDAYS: string = TRANSLATION_ROOT + 'weekday';
const TRANSLATION_SUFFIXE: string = '.short';

enum MonthsNames {
    JANUARY = 'january',
    FEBRUARY = 'february',
    MARCH = 'march',
    APRIL = 'april',
    MAY = 'may',
    JUNE = 'june',
    JULY = 'july',
    AUGUST = 'august',
    SEPTEMBER = 'september',
    OCTOBER = 'october',
    NOVEMBER = 'november',
    DECEMBER = 'december'
}

enum WeekdayNames {
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday'
}

enum PickerMode {
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

enum DatePrecision {
    YEAR = 'year',
    MONTH = 'month',
    DAY = 'day'
}



enum DaysMonthBeforeAfter {
    SHOW = 'show',
    HIDE = 'hide'
}

enum DateSelectionMode {
    SINGLE = 'single',
    RANGE = 'range'
}

enum DateRangePosition {
    BEGIN = 'begin',
    END = 'end'
}

enum OffsetLocation {
    BEFORE = 'before',
    AFTER = 'after'
}

const offsetModifier: { [name: string]: number } = {
    [OffsetLocation.BEFORE]: -1,
    [OffsetLocation.AFTER]: 1
};

type CalendarModel = string | CalendarRange;

export interface CalendarRange {
    begin: string;
    end: string;
}

interface CalendarRangeInternalModel {
    begin: Date | undefined;
    end: Date | undefined;
}

interface DatepickerDateDisplay {
    date: number;
    month: number;
    year: number;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
    isHidden: boolean;
}

@WithRender
@Component({
    mixins: [
        MediaQueries
    ]
})
export class MCalendar extends ModulVue {

    @Prop()
    value: CalendarModel;

    @Prop()
    minDate: string;

    @Prop()
    maxDate: string;

    @Prop({ default: DateSelectionMode.SINGLE })
    dateSelectionMode: DateSelectionMode;

    @Prop({ default: DaysMonthBeforeAfter.SHOW })
    showMonthBeforeAfter: DaysMonthBeforeAfter;

    @Prop({
        default: () => {
            return Object.keys(MonthsNames).map((key: string) => {
                return Vue.prototype.$i18n.translate(
                    `${TRANSLATION_MONTHS}.${MonthsNames[key]}${TRANSLATION_SUFFIXE}`
                );
            });
        }
    })
    monthsNames: string[];

    @Prop({
        default: () => {
            return Object.keys(MonthsNames).map((key: string) => {
                return Vue.prototype.$i18n.translate(
                    `${TRANSLATION_MONTHS}.${MonthsNames[key]}`
                );
            });
        }
    })
    monthsNamesLong: string[];

    @Prop({
        default: () => {
            return Object.keys(WeekdayNames).map((key: string) => {
                return Vue.prototype.$i18n.translate(
                    `${TRANSLATION_WEEKDAYS}.${WeekdayNames[key]}${TRANSLATION_SUFFIXE}`
                );
            });
        }
    })
    daysNames: string[];

    id: string = `m-calendar-${uuid.generate()}`;

    previousMonthLabel: string = this.$i18n.translate('m-calendar:previous.month');
    nextMonthLabel: string = this.$i18n.translate('m-calendar:next.month');
    previousYearLabel: string = this.$i18n.translate('m-calendar:previous.year');
    nextYearLabel: string = this.$i18n.translate('m-calendar:next.year');

    private currentDate: Date | CalendarRangeInternalModel;

    private now: Date = new Date();

    private currentlyDisplayedDate: Date = new Date();
    private currentMinDate: Date = new Date();
    private currentMaxDate: Date = new Date();

    private pickerMode: PickerMode = PickerMode.DAY;

    created(): void {
        this.initDates();
    }

    @Watch('value')
    refreshValue(): void {
        this.initDates();
    }

    initDates(): void {
        if (this.value) {
            this.initInternalModel(this.value);
        }

        this.currentMinDate = new Date(this.minDate as string);
        if (!this.minDate) {
            this.currentMinDate = this.calculateYearOffset(this.now, MIN_DATE_OFFSET, OffsetLocation.BEFORE);
        }

        this.currentMaxDate = new Date(this.maxDate as string);
        if (!this.maxDate) {
            this.currentMaxDate = this.calculateYearOffset(this.now, MAX_DATE_OFFSET, OffsetLocation.AFTER);
        }

        if (!this.currentDate) {
            this.updateCurrentlyDisplayedDate(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
        }
    }

    nextMonth(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, this.currentlyDisplayedMonth + 1, this.currentlyDisplayedDay);
    }

    previousMonth(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, this.currentlyDisplayedMonth - 1, this.currentlyDisplayedDay);
    }

    nextYear(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear + 1, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
    }

    previousYear(): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear - 1, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
    }

    showMonthPicker(): void {
        this.pickerMode = PickerMode.MONTH;
    }

    showYearPicker(): void {
        this.pickerMode = PickerMode.YEAR;
    }

    showYears(): void {
        this.pickerMode = PickerMode.YEAR;
    }

    selectYear(year: number, showMonths: boolean = false): void {
        this.updateCurrentlyDisplayedDate(year, this.currentlyDisplayedMonth, this.currentlyDisplayedDay);
        if (showMonths) {
            this.pickerMode = PickerMode.MONTH;
        }
    }

    selectMonth(month: number, showDays: boolean = false): void {
        this.updateCurrentlyDisplayedDate(this.currentlyDisplayedYear, month, this.currentlyDisplayedDay);
        if (showDays) {
            this.pickerMode = PickerMode.DAY;
        }
    }

    selectDate(selectedDate: DatepickerDateDisplay): void {
        if (!selectedDate.isDisabled) {
            const newDate: Date = new Date(selectedDate.year, selectedDate.month, selectedDate.date);
            switch (this.dateSelectionMode) {
                case DateSelectionMode.SINGLE:
                    this.currentDate = newDate;
                    this.$emit('input', this.dateToISOString(this.currentDate));
                    break;
                case DateSelectionMode.RANGE:
                    this.currentDate = this.updateRangeModel(this.currentDate as CalendarRangeInternalModel, newDate);
                    this.currentDate = this.reOrderRangeDates(this.currentDate);

                    this.$emit('input', {
                        begin: this.currentDate.begin ? this.dateToISOString(this.currentDate.begin) : '',
                        end: this.currentDate.end ? this.dateToISOString(this.currentDate.end) : ''
                    });
                    break;
            }
        }
    }

    get currentlyDisplayedYear(): number {
        return this.currentlyDisplayedDate.getFullYear();
    }

    get currentlyDisplayedMonth(): number {
        return this.currentlyDisplayedDate.getMonth();
    }

    get currentlyDisplayedDay(): number {
        return this.currentlyDisplayedDate.getDate();
    }

    get currentlyDisplayedMonthName(): string {
        return this.monthsNamesLong[this.currentlyDisplayedMonth];
    }

    get weekdaysLabels(): string[] {
        return this.daysNames;
    }

    get years(): number[] {
        let years: number[] = [];
        for (let year: number = this.currentMaxDate.getFullYear(); year >= this.currentMinDate.getFullYear(); year--) {
            years.push(year);
        }
        return this.prepareDataForTableLayout(years, NB_YEARS_PER_ROW);
    }

    get months(): any[] {
        let months: any[] = [];
        let date: Date;
        for (let index: number = FIRST_MONTH_INDEX; index <= LAST_MONTH_INDEX; index++) {
            date = new Date(this.currentlyDisplayedDate.getFullYear(), index, 1);
            months.push({
                index,
                name: this.monthsNames[index],
                isDisabled: !this.isBetweenStrict(this.currentMinDate, this.currentMaxDate, date, DatePrecision.MONTH)
            });
        }
        return this.prepareDataForTableLayout(months, 3);
    }

    get isPickerModeYear(): boolean {
        return this.pickerMode === PickerMode.YEAR;
    }

    get isPickerModeMonth(): boolean {
        return this.pickerMode === PickerMode.MONTH;
    }

    get isPickerModeDay(): boolean {
        return this.pickerMode === PickerMode.DAY;
    }

    get isMinYear(): boolean {
        return this.isSameOrBefore(this.currentMinDate, this.currentlyDisplayedDate, DatePrecision.YEAR);
    }

    get isMaxYear(): boolean {
        return this.isSameOrAfter(this.currentMaxDate, this.currentlyDisplayedDate, DatePrecision.YEAR);
    }

    get isMinMonth(): boolean {
        return this.isSameOrBefore(this.currentMinDate, this.currentlyDisplayedDate, DatePrecision.MONTH);
    }

    get isMaxMonth(): boolean {
        return this.isSameOrAfter(this.currentMaxDate, this.currentlyDisplayedDate, DatePrecision.MONTH);
    }

    get daysOfMonth(): DatepickerDateDisplay[] {
        return this.prepareDataForTableLayout(this.buildDaysList(), 7);
    }

    private initInternalModel(value: CalendarModel): void {
        switch (this.dateSelectionMode) {
            case DateSelectionMode.SINGLE:
                this.currentDate = new Date(value as string);
                break;
            case DateSelectionMode.RANGE:
                this.currentDate = {
                    begin: this.initDateRange(value as CalendarRange, DateRangePosition.BEGIN),
                    end: this.initDateRange(value as CalendarRange, DateRangePosition.END)
                };
                break;
        }
    }

    private initDateRange(dates: CalendarRange, position: DateRangePosition): Date | undefined {
        return (dates[position]) ? new Date(dates[position]) : undefined;
    }

    private updateRangeModel(range: CalendarRangeInternalModel, date: Date): CalendarRangeInternalModel {
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

    private reOrderRangeDates(range: CalendarRangeInternalModel): CalendarRangeInternalModel {
        if (range.begin
            && range.end
            && this.isBefore(range.begin as Date, range.end as Date, DatePrecision.DAY)
        ) {
            const temp: Date = range.begin;
            range.begin = range.end;
            range.end = temp;
        }
        return range;
    }

    private weekdayIndexOfFirstDayOfMonth(date: Date): number {
        const dateFirstOfMonth: Date = new Date(date.getFullYear(), date.getMonth(), 1);
        return dateFirstOfMonth.getDay();
    }

    private weekdayIndexOfLastDayOfMonth(date: Date): number {
        const dateLastOfMonth: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return dateLastOfMonth.getDay();
    }

    private daysInMonth(date: Date): number {
        const dateLastOfMonth: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return dateLastOfMonth.getDate();
    }

    /**
     * Bounds are INCLUDED from comparison
     *
     * @param lowerBound minimum date
     * @param higherBound maximum date
     * @param comparedDate date under test
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isBetween(lowerBound: Date, higherBound: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.isSameOrAfter(lowerBound, comparedDate, precision) && this.isSameOrBefore(higherBound, comparedDate, precision);
    }

    /**
     * Bounds are EXCLUDED from comparison
     *
     * @param lowerBound minimum date
     * @param higherBound maximum date
     * @param comparedDate date under test
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isBetweenStrict(lowerBound: Date, higherBound: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.isAfter(lowerBound, comparedDate, precision) && this.isBefore(higherBound, comparedDate, precision);
    }

    /**
     * Determines if the date is the same as the pivot
     *
     * @param pivot date to compare against
     * @param comparedDate date that need to be compare
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isSame(pivot: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.compareDates(comparedDate, pivot, precision) === 0;
    }

    /**
     * Determines if the date comes before or after/same as the pivot
     *
     * @param pivot date to compare against
     * @param comparedDate date that need to be compare
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isSameOrAfter(pivot: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.compareDates(comparedDate, pivot, precision) >= 0;
    }

    /**
     * Determines if the date comes strictly after as the pivot
     *
     * @param pivot date to compare against
     * @param comparedDate date that need to be compare
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isAfter(pivot: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.compareDates(comparedDate, pivot, precision) > 0;
    }

    /**
     * Determines if the date comes before/same or after the pivot
     *
     * @param pivot date to compare against
     * @param comparedDate date that need to be compare
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isSameOrBefore(pivot: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.compareDates(comparedDate, pivot, precision) <= 0;
    }

    /**
     * Determines if the date comes strictly before the pivot
     *
     * @param pivot date to compare against
     * @param comparedDate date that need to be compare
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private isBefore(pivot: Date, comparedDate: Date, precision: DatePrecision): boolean {
        return this.compareDates(comparedDate, pivot, precision) < 0;
    }

    /**
     * Compares two dates together
     *
     * @param lhs First date to compare
     * @param rhs Second date to compare
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     * @returns -1 if lhs < rhs | 0 if lhs = rhs | 1 if lhs > rhs
     */
    private compareDates(lhs: Date, rhs: Date, precision: DatePrecision): number {
        const lhsUTC: number = this.dateToUTC(lhs, precision);
        const rhsUTC: number = this.dateToUTC(rhs, precision);
        if (lhsUTC > rhsUTC) {
            return 1;
        } else if (lhsUTC < rhsUTC) {
            return -1;
        }
        return 0;
    }

    /**
     * Convert a date to UTC time following strict precision
     *
     * @param date to transform
     * @param precision level for comparison (Year, Year + month, Year + month + day)
     */
    private dateToUTC(date: Date, precision: DatePrecision): number {
        switch (precision) {
            case DatePrecision.YEAR:
                return date.getUTCFullYear();
            case DatePrecision.MONTH:
                return Date.UTC(date.getFullYear(), date.getMonth());
            case DatePrecision.DAY:
                return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        }
    }

    private calculateYearOffset(date: Date, offset: number, location: OffsetLocation): Date {
        return new Date(date.getFullYear() + (offset * offsetModifier[location]), date.getMonth(), date.getDate());
    }

    /**
     * Updates the date used to display the calendar. If it's lower than the minimum date authorized, it's set to the minimum.
     * If it's higher than the maximum date authorized, it's set to the maximum
     *
     * @param year new value
     * @param month new value
     * @param day new value
     */
    private updateCurrentlyDisplayedDate(year: number, month: number, day: number): void {
        this.currentlyDisplayedDate = new Date(year, month, day);

        if (this.isAfter(this.currentMaxDate, this.currentlyDisplayedDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new Date(this.currentMaxDate);
        }

        if (this.isBefore(this.currentMinDate, this.currentlyDisplayedDate, DatePrecision.DAY)) {
            this.currentlyDisplayedDate = new Date(this.currentMinDate);
        }
    }

    private buildDaysList(): DatepickerDateDisplay[] {
        const startDate: Date = this.calculateStartDate(this.currentlyDisplayedDate);
        const endDate: Date = this.calculateEndDate(this.currentlyDisplayedDate);
        const numberOfDays: number = this.deltaInDays(startDate, endDate);

        let days: DatepickerDateDisplay[] = [];
        let date: Date;
        for (let index: number = 0; index <= numberOfDays; index++) {
            date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + index);
            days.push({
                date: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                isDisabled: this.isDayDisabled(date),
                isToday: this.isDayToday(date),
                isSelected: this.isDaySelected(date),
                isHidden: this.isDayHidden(date)
            });
        }
        return days;
    }

    private isDayDisabled(date: Date): boolean {
        return this.isBefore(this.currentMinDate, date, DatePrecision.DAY) || this.isAfter(this.currentMaxDate, date, DatePrecision.DAY);
    }

    private isDayToday(date: Date): boolean {
        return this.isSame(this.now, date, DatePrecision.DAY);
    }

    private isDaySelected(date: Date): boolean {
        switch (this.dateSelectionMode) {
            case DateSelectionMode.SINGLE:
                const dateModel: Date = this.currentDate as Date;
                return dateModel && this.isSame(date, dateModel, DatePrecision.DAY);
            case DateSelectionMode.RANGE:
                const rangeModel: CalendarRangeInternalModel = this.currentDate as CalendarRangeInternalModel;
                return (!!rangeModel.begin && !!rangeModel.end && this.isBetween(rangeModel.begin, rangeModel.end, date, DatePrecision.DAY))
                    || (!!rangeModel.begin && this.isSame(rangeModel.begin, date, DatePrecision.DAY))
                    || (!!rangeModel.end && this.isSame(rangeModel.end, date, DatePrecision.DAY));
        }
    }

    private isDayHidden(date: Date): boolean {
        return !(date.getMonth() === this.currentlyDisplayedMonth || this.showMonthBeforeAfter === DaysMonthBeforeAfter.SHOW);
    }

    private calculateStartDate(date: Date): Date {
        const startOffset: number = this.weekdayIndexOfFirstDayOfMonth(date);
        return new Date(date.getFullYear(), date.getMonth(), 1 - startOffset);
    }

    private calculateEndDate(date: Date): Date {
        const endOffset: number = LAST_DAY_OF_WEEK_INDEX - this.weekdayIndexOfLastDayOfMonth(date);
        return new Date(date.getFullYear(), date.getMonth(), this.daysInMonth(date) + endOffset);
    }

    private deltaInDays(startDate: Date, endDate: Date): number {
        return Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    }

    private prepareDataForTableLayout(data: any[], nbItemPerRow: number): any[] {
        let nbRow: number = Math.ceil(data.length / nbItemPerRow);
        let dataTable: any[] = [];
        let count: number = 0;
        for (let row: number = 0; row < nbRow; row++) {
            let newRow: any[] = [];
            for (let index: number = 0; index < nbItemPerRow; index++) {
                newRow.push(data[count]);
                count++;
            }
            dataTable.push(newRow);
        }
        return dataTable;
    }

    /**
     * Format date to follow ISO8601
     *
     * @param date to format
     */
    private dateToISOString(date: Date): string {
        return date.toISOString();
    }
}

const CalendarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(CALENDAR_NAME + ' is not ready for production');
        v.use(MediaQueriesPlugin);
        v.component(CALENDAR_NAME, MCalendar);
    }
};

export default CalendarPlugin;
