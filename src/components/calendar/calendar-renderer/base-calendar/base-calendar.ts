import { Component, Prop, Vue } from 'vue-property-decorator';
import uuid from '../../../../utils/uuid/uuid';
import { MLinkMode } from '../../../link/link';
import { RangeDate } from '../../calendar-state/state/abstract-calendar-state';
import { CalendarType, DayState, MonthState, YearState } from '../../calendar-state/state/calendar-state';
import ModulDate, { DatePrecision } from './../../../../utils/modul-date/modul-date';
import { MAbstractCalendarRenderer } from './../abstract-calendar-renderer';
import WithRender from './base-calendar.html?style=./base-calendar.scss';

const TRANSLATION_ROOT: string = 'm-calendar' + ':';
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

export enum PickerMode {
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

@WithRender
@Component
export default class MBaseCalendar extends MAbstractCalendarRenderer {

    @Prop({ default: PickerMode.DAY })
    initialPickerMode: PickerMode;

    @Prop({ default: true })
    showMonthBeforeAfter: boolean;

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

    previousMonthLabel: string = this.$i18n.translate('m-calendar:previous.month');
    nextMonthLabel: string = this.$i18n.translate('m-calendar:next.month');
    previousYearLabel: string = this.$i18n.translate('m-calendar:previous.year');
    nextYearLabel: string = this.$i18n.translate('m-calendar:next.year');

    id: string = `m-simple-calendar-${uuid.generate()}`;

    public modeLinkCurrentMonthAndYear: MLinkMode = MLinkMode.Button;
    private currentPickerMode: PickerMode = this.initialPickerMode;


    onYearClick(): void {
        this.currentPickerMode = this.isPickerModeDay ? this.currentPickerMode = PickerMode.YEAR : this.currentPickerMode = PickerMode.DAY;
    }

    onYearSelect(year: YearState): void {
        super.onYearSelect(year);
        this.currentPickerMode = PickerMode.MONTH;
    }

    onYearNext(event: Event): void {
        super.onYearNext(event);
    }

    onYearPrevious(event: Event): void {
        super.onYearPrevious(event);
    }

    onMonthClick(): void {
        this.currentPickerMode = PickerMode.MONTH;
    }

    onMonthSelect(month: MonthState): void {
        if (!month.isDisabled) {
            super.onMonthSelect(month);
            this.currentPickerMode = PickerMode.DAY;
        }
    }

    onMonthNext(event: Event): void {
        super.onMonthNext(event);
    }

    onMonthPrevious(event: Event): void {
        super.onMonthPrevious(event);
    }

    monthTabIndex(month: MonthState): string {
        return month.isDisabled ? '-1' : '0';
    }

    onDaySelect(day: DayState): void {
        super.onDaySelect(day);

        // TODO when there will be a directive to manage focus, replace this behaviour with it
        this.$nextTick(() => (this.$refs[this.buildRef('day', day)][0] as HTMLButtonElement).focus());
    }

    onDayMouseEnter(day: DayState): void {
        super.onDayMouseEnter(day);
    }

    onDaykeyboardTab(day: DayState): void {
        super.onDayKeyboardTab(day);
    }

    onDayMouseLeave(day: DayState): void {
        super.onDayMouseLeave(day);
    }

    dayTabIndex(day: DayState): string {
        return day.isDisabled || this.hideDay(day) ? '-1' : '0';
    }

    isDateInFuture(day: DayState): boolean {
        return !!this.calendar.type && this.calendar.type === CalendarType.DATE_RANGE
            && !!this.calendar.value && !!(this.calendar.value as RangeDate).begin
            && day.date.isAfter(new ModulDate((this.calendar.value as RangeDate).begin));
    }

    isInsideRange(day: DayState): boolean {
        return !!this.calendar.type && this.calendar.type === CalendarType.DATE_RANGE
            && !!this.calendar.value && !!(this.calendar.value as RangeDate).begin
            && !!this.calendar.value && !!(this.calendar.value as RangeDate).end
            && day.isHighlighted;
    }

    isSelectionStart(day: DayState): boolean {
        return day.isSelectionStart && !this.hideDay(day);
    }

    isSelectionEnd(day: DayState): boolean {
        return day.isSelectionEnd && !this.hideDay(day);
    }

    hideDay(day: DayState): boolean {
        return (day.isInNextMonth || day.isInPreviousMonth) && !this.showMonthBeforeAfter;
    }

    buildRef(prefix: string, state: DayState | MonthState | YearState): string {
        const parts: string[] = [prefix];

        if ('year' in state) {
            parts.push(this.padString(state.year.toString(), 4));
        }
        if ('month' in state) {
            parts.push(this.padString((state.month + 1).toString()));
        }
        if ('day' in state) {
            parts.push(this.padString(state.day.toString()));
        }

        return parts.join('');
    }

    monthIndexToShortName(index: number): string {
        return this.monthsNames[index];
    }

    get currentYear(): number {
        return this.calendar.dates.current.fullYear();
    }

    get currentMonth(): number {
        return this.calendar.dates.current.month();
    }

    get currentMonthName(): string {
        return this.monthsNamesLong[this.currentMonth];
    }

    get weekdaysLabels(): string[] {
        return this.daysNames;
    }

    get years(): {} {
        return this.calendar.years;
    }

    get months(): {} {
        return this.calendar.months;
    }

    get isPickerModeYear(): boolean {
        return this.currentPickerMode === PickerMode.YEAR;
    }

    get isPickerModeMonth(): boolean {
        return this.currentPickerMode === PickerMode.MONTH;
    }

    get isPickerModeDay(): boolean {
        return this.currentPickerMode === PickerMode.DAY;
    }

    get isMinYear(): boolean {
        return this.currentYear === Math.min(...this.calendar.years.map((year: YearState) => year.year));
    }

    get isMaxYear(): boolean {
        return this.currentYear === Math.max(...this.calendar.years.map((year: YearState) => year.year));
    }

    get isMinMonth(): boolean {
        return this.calendar.dates.current.isSameOrBefore(this.calendar.dates.min, DatePrecision.MONTH);
    }

    get isMaxMonth(): boolean {
        return this.calendar.dates.current.isSameOrAfter(this.calendar.dates.max, DatePrecision.MONTH);
    }

    get isMaxRow(): boolean {
        let numberOfDays: number = this.calendar.days.length;
        return numberOfDays / 7 > 5 ? true : false;
    }

    get days(): DayState[] {
        return this.calendar.days;
    }

    private padString(value: any, length: number = 2): string {
        return ('000' + value).slice(-1 * length);
    }
}
