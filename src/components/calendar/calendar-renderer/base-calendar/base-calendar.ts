import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Enums } from '../../../../utils/enums/enums';
import uuid from '../../../../utils/uuid/uuid';
import { MLinkMode } from '../../../link/link';
import { MCalendarButton } from '../../calendar-button/calendar-button';
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

export enum MBaseCalendarView {
    DAYS = 'days',
    YEARS_MONTHS = 'years-months'
}

export enum MBaseCalendarType {
    FULL_DATE = 'full-date',
    YEARS_MONTHS = 'years-months'
}

@WithRender
@Component({
    components: {
        MCalendarButton
    }
})
export default class MBaseCalendar extends MAbstractCalendarRenderer {

    @Prop({
        default: MBaseCalendarView.DAYS,
        validator: value => Enums.toValueArray(MBaseCalendarView).includes(value)
    })
    initialView: MBaseCalendarView;

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

    @Prop({
        default: MBaseCalendarType.FULL_DATE,
        validator: value => Enums.toValueArray(MBaseCalendarType).includes(value)
    })
    type: MBaseCalendarType;

    @Prop({ default: true })
    visible: boolean;

    mBaseCalendarView = MBaseCalendarView;
    previousMonthLabel: string = this.$i18n.translate('m-calendar:previous.month');
    nextMonthLabel: string = this.$i18n.translate('m-calendar:next.month');
    previousYearLabel: string = this.$i18n.translate('m-calendar:previous.year');
    nextYearLabel: string = this.$i18n.translate('m-calendar:next.year');
    id: string = `m-simple-calendar-${uuid.generate()}`;

    $refs: {
        body: HTMLElement;
        yearsMonthsView: HTMLElement;
    };

    public modeLinkCurrentMonthAndYear: MLinkMode = MLinkMode.Button;
    animReady: boolean = false;
    private internalCurrentView: MBaseCalendarView = MBaseCalendarView.DAYS;

    @Watch('visible', { immediate: true })
    visibleChanged(visible: boolean): void {
        if (visible && this.isTypeYearsMonths) {
            this.scrollToCurrentYear();
        }
    }

    protected created(): void {
        this.currentView = this.initialView; // Set currentView value in created() to hide animation when the component is diplayed for the firt time
    }

    onToogleView(): void {
        this.currentView === MBaseCalendarView.DAYS ? this.currentView = MBaseCalendarView.YEARS_MONTHS : this.currentView = MBaseCalendarView.DAYS;
    }

    onYearMonthSelect(year: YearState, month: MonthState): void {
        if (!month.isDisabled) {
            month.isCurrent = true;

            if (this.isTypeYearsMonths) {
                super.onYearMonthSelect(year, month);
            } else {
                super.onYearSelect(year);
                super.onMonthSelect(month);

                // Delay to show the user selection
                setTimeout(() => {
                    this.currentView = MBaseCalendarView.DAYS;
                }, 300);
            }
        }
    }

    onYearNext(event: Event): void {
        super.onYearNext(event);
    }

    onYearPrevious(event: Event): void {
        super.onYearPrevious(event);
    }

    onMonthNext(event: Event): void {
        super.onMonthNext(event);
    }

    onMonthPrevious(event: Event): void {
        super.onMonthPrevious(event);
    }

    onDaySelect(day: DayState): void {
        super.onDaySelect(day);
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

    buildRef(refPrefix: MBaseCalendarView, year: number, month: number, day?: number): string {
        let refName: string = `${refPrefix}-${this.padString(year, 4)}-${this.padString(month, 2)}`;
        if (refPrefix === MBaseCalendarView.DAYS) {
            return `${refName}-${this.padString(day, 2)}`;
        }
        return refName;
    }

    monthIndexToShortName(index: number): string {
        return this.monthsNames[index];
    }

    scrollToCurrentYear(): void {
        this.$nextTick(() => {
            let yearsMonthsViewEl: HTMLElement = this.$refs.yearsMonthsView;
            const spacingBeforeCurrentYear: number = 16;
            if (yearsMonthsViewEl) {
                yearsMonthsViewEl.scrollTop = (yearsMonthsViewEl.querySelector('[data-current-year="true"]') as HTMLElement).offsetTop - spacingBeforeCurrentYear || 0;
            }
        });
    }

    set currentView(view: MBaseCalendarView) {
        if (this.isTypeYearsMonths) {
            this.internalCurrentView = MBaseCalendarView.YEARS_MONTHS;
        } else {
            this.internalCurrentView = view;
        }
    }

    get currentView(): MBaseCalendarView {
        return this.internalCurrentView;
    }

    get isTypeYearsMonths(): boolean {
        return this.type === MBaseCalendarType.YEARS_MONTHS;
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

    get yearsMonths(): {} {
        return this.calendar.yearsMonths;
    }

    get months(): {} {
        return this.calendar.months;
    }

    get days(): {} {
        return this.calendar.days;
    }

    get isYearsMonthsView(): boolean {
        return this.currentView === MBaseCalendarView.YEARS_MONTHS;
    }

    get isDaysView(): boolean {
        return this.currentView === MBaseCalendarView.DAYS;
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
        if (this.isTypeYearsMonths) {
            return false;
        }
        let numberOfDays: number = this.calendar.days.length;
        return numberOfDays / 7 > 5 ? true : false;
    }

    get isButtonToogleViewDisabled(): boolean {
        return this.isMinMonth && this.isMaxYear || this.isTypeYearsMonths;
    }

    private padString(value: any, length: number = 2): string {
        return ('000' + value).slice(-1 * length);
    }
}
