import { Component, Prop, Vue } from 'vue-property-decorator';
import DateUtil, { DatePrecision } from '../../../utils/date-util/date-util';
import uuid from '../../../utils/uuid/uuid';
import { DayState, MonthState, YearState } from '../calendar-state/abstract-calendar-state';
import { MAbstractCalendarRenderer } from './abstract-calendar-renderer';
import WithRender from './simple-calendar.html?style=./simple-calendar.scss';

const TRANSLATION_ROOT: string = 'm-calendar' + ':';
const TRANSLATION_MONTHS: string = TRANSLATION_ROOT + 'month';
const TRANSLATION_WEEKDAYS: string = TRANSLATION_ROOT + 'weekday';
const TRANSLATION_SUFFIXE: string = '.short';

const NB_YEARS_PER_ROW: number = 4;

const FIRST_MONTH_INDEX: number = 0;
const LAST_MONTH_INDEX: number = 11;

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

@WithRender
@Component
export class MSimpleCalendar extends MAbstractCalendarRenderer {

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

    private now: Date = new Date();
    private currentPickerMode: PickerMode = this.initialPickerMode;

    onMonthClick(): void {
        this.currentPickerMode = PickerMode.MONTH;
    }

    onYearClick(): void {
        this.currentPickerMode = PickerMode.YEAR;
    }

    onYearSelect(event: Event): void {
        this.currentPickerMode = PickerMode.MONTH;
        super.onYearSelect(event);
    }

    onMonthSelect(event: Event): void {
        this.currentPickerMode = PickerMode.DAY;
        super.onMonthSelect(event);
    }

    hideDay(isInCurrentMonth: boolean): boolean {
        return !isInCurrentMonth && !this.showMonthBeforeAfter;
    }


    get currentlyDisplayedYear(): number {
        const currentYear: YearState | undefined = this.calendar.years.find((year: YearState) => year.isCurrent);
        if (currentYear) {
            return currentYear.year;
        }
        return this.now.getFullYear();
    }

    get currentlyDisplayedMonth(): number {
        const currentMonth: MonthState | undefined = this.calendar.months.find((month: MonthState) => month.isCurrent);
        if (currentMonth) {
            return currentMonth.month;
        }
        return this.now.getMonth();
    }


    get currentYear(): number {
        const currentYear: YearState | undefined = this.calendar.years.find((year: YearState) => year.isCurrent);
        if (currentYear) {
            return currentYear.year;
        }
        return this.now.getFullYear();
    }

    get currentMonth(): number {
        const currentMonth: MonthState | undefined = this.calendar.months.find((month: MonthState) => month.isCurrent);
        if (currentMonth) {
            return currentMonth.month;
        }
        return this.now.getMonth();
    }

    get currentlyDisplayedDay(): number {
        return this.now.getDate();
    }

    get currentlyDisplayedMonthName(): string {
        return this.monthsNamesLong[this.currentMonth];
    }

    get weekdaysLabels(): string[] {
        return this.daysNames;// ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'];
    }

    get years(): number[] {
        let years: YearState[] = [];
        for (let year: number = this.calendar.dates.max.fullYear(); year >= this.calendar.dates.min.fullYear(); year--) {
            years.push({ year: year, isCurrent: this.calendar.dates.current.fullYear() === year });
        }
        return this.prepareDataForTableLayout(years, NB_YEARS_PER_ROW);
    }

    get months(): any[] {
        let months: any[] = [];
        let date: DateUtil;
        for (let index: number = FIRST_MONTH_INDEX; index <= LAST_MONTH_INDEX; index++) {
            date = new DateUtil(this.calendar.dates.current.fullYear(), index, 1);
            months.push({
                index,
                name: this.monthsNames[index],
                isDisabled: !date.isBetweenStrict(this.calendar.dates.min, this.calendar.dates.max, DatePrecision.MONTH)
            });
        }
        return this.prepareDataForTableLayout(months, 3);
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
        return this.currentYear === this.calendar.years.slice(-1)[0].year;
    }

    get isMaxYear(): boolean {
        return this.currentYear === this.calendar.years[0].year;
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
}
