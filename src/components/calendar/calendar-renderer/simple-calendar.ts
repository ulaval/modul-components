import { Component, Prop, Vue } from 'vue-property-decorator';
import uuid from '../../../utils/uuid/uuid';
import { DayState, MonthState, YearState } from '../calendar-state/state/calendar-state';
import { DatePrecision } from './../../../utils/modul-date/modul-date';
import { MAbstractCalendarRenderer } from './abstract-calendar-renderer';
import WithRender from './simple-calendar.html?style=./simple-calendar.scss';

const TRANSLATION_ROOT: string = 'm-calendar' + ':';
const TRANSLATION_MONTHS: string = TRANSLATION_ROOT + 'month';
const TRANSLATION_WEEKDAYS: string = TRANSLATION_ROOT + 'weekday';
const TRANSLATION_SUFFIXE: string = '.short';

const NB_YEARS_PER_ROW: number = 4;
const NB_MONTHS_PER_ROW: number = 3;

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
export default class MSimpleCalendar extends MAbstractCalendarRenderer {

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

    private currentPickerMode: PickerMode = this.initialPickerMode;

    onYearClick(): void {
        this.currentPickerMode = PickerMode.YEAR;
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
        super.onMonthSelect(month);
        this.currentPickerMode = PickerMode.DAY;
    }

    onMonthNext(event: Event): void {
        super.onMonthNext(event);
    }

    onMonthPrevious(event: Event): void {
        super.onMonthPrevious(event);
    }

    onDaySelect(day: DayState): void {
        super.onDaySelect(day);

        // TODO when there will be a directive to manage focus, replace this behaviour with it
        this.$nextTick(() => (this.$refs[this.buildRef('day', day)][0] as HTMLButtonElement).focus());
    }

    onDayMouseEnter(day: DayState): void {
        super.onDayMouseEnter(day);
    }

    onDayMouseLeave(day: DayState): void {
        super.onDayMouseLeave(day);
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

    get years(): number[] {
        return this.prepareDataForTableLayout(this.calendar.years, NB_YEARS_PER_ROW);
    }

    get months(): number[] {
        return this.prepareDataForTableLayout(this.calendar.months, NB_MONTHS_PER_ROW);
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

    get daysOfMonth(): DayState[] {
        return this.prepareDataForTableLayout(this.calendar.days, 7);
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

    private padString(value: any, length: number = 2): string {
        return ('000' + value).slice(-1 * length);
    }
}
