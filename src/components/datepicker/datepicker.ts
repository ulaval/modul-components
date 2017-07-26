import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './datepicker.html?style=./datepicker.scss';
import { DATEPICKER_NAME } from '../component-names';
import * as moment from 'moment';

const VIEW_DAY = 'day';
const VIEW_MONTH = 'month';
const VIEW_YEAR = 'year';

interface SelectionDate {
    day: number;
    month: number;
    year: number;
}

@WithRender
@Component
export class MDatepicker extends Vue {

    @Prop({ default: 'date' })
    public type: string;
    @Prop({ default: 'L' })
    public format: string;
    @Prop()
    public min: any;
    @Prop()
    public max: any;

    private view: string = 'day';
    private today: moment.Moment = moment().local();
    private selectedDate: SelectionDate = { day: 0, month: 0, year: 0 };
    private formattedDate: string = this.today.format(this.format);
    private weekdays: string[] = moment.weekdaysMin();
    private months: string[] = moment.monthsShort();
    private years: number[] = [];
    private leadingDays: SelectionDate[] = [];
    private days: SelectionDate[] = [];
    private TrailingDays: SelectionDate[] = [];

    private yearRows: any[] = [];
    private monthRows: any[] = [];
    private dayRows: any[] = [];

    private created(): void {
        this.selectedDate.day = this.today.date();
        this.selectedDate.month = this.today.month();
        this.selectedDate.year = this.today.year();

        let year: number = this.selectedDate.year;
        for (let index = year - 10; index < year + 10; index++) {
            this.years.push(index);
        }
        this.refreshDates();

        this.yearRows = this.prepareDataForTableLayout(this.years, 5);
        this.monthRows = this.prepareDataForTableLayout(this.months, 3);
    }

    private prepareDataForTableLayout(data: any[], nbItemPerRow: number): any[] {
        let nbRow: number = Math.floor(data.length / nbItemPerRow);
        let dataTable: any[] = [];
        let count: number = 0;
        for (let row = 0; row < nbRow; row++) {
            let newRow: any[] = [];
            for (let index = 0; index < nbItemPerRow; index++) {
                newRow.push(data[count]);
                count++;
            }
            dataTable.push(newRow);
        }
        return dataTable;
    }

    private get monthName(): string {
        return this.months[this.selectedDate.month];
    }

    private isSelectedDate(date: SelectionDate): boolean {
        return (date.day == this.selectedDate.day && date.month == this.selectedDate.month && date.year == this.selectedDate.year);
    }

    private isInSelectedMonth(date: SelectionDate): boolean {
        return date.month == this.selectedDate.month;
    }

    private computeLeadingDays(): SelectionDate[] {
        let monthStartsAt = moment(this.selectedDate).startOf('month').weekday();
        let days: SelectionDate[] = [];

        for (let index = monthStartsAt; index > 0; index--) {
            let date = moment(this.selectedDate).startOf('month').subtract(index, 'days');
            days.push({ day: date.date(), month: date.month(), year: date.year() });
        }
        return days;
    }

    private computeDays(): SelectionDate[] {
        let lastDayOfMonth: number = moment(this.selectedDate).daysInMonth();
        let month: number = this.selectedDate.month;
        let year: number = this.selectedDate.year;
        let days: SelectionDate[] = [];

        for (let index = 1; index <= lastDayOfMonth; index++) {
            days.push({ day: index, month, year });

        }
        return days;
    }

    private computeTrailingDays(): SelectionDate[] {
        let daysToDisplayFromNextMonth = 6 - moment(this.selectedDate).endOf('month').weekday();
        let days: SelectionDate[] = [];

        for (let index = 1; index <= daysToDisplayFromNextMonth; index++) {
            let date = moment(this.selectedDate).endOf('month').add(index, 'days');
            days.push({ day: date.date(), month: date.month(), year: date.year() });
        }
        return days;
    }

    private formatDate(): void {
        this.formattedDate = moment(this.selectedDate).format(this.format);
    }

    private openDatepicker(): void {
        this.$emit('open');
    }

    private closeDatepicker(): void {
        this.formatDate();
        this.$children[0]['closePopper']();
        this.$emit('close');
    }

    private selectDate(selectedDate: SelectionDate): void {
        this.selectedDate = selectedDate;
        this.$emit('selected', this.selectedDate);
        this.closeDatepicker();
    }

    private refreshDates(): void {
        this.leadingDays = this.computeLeadingDays();
        this.days = this.computeDays();
        this.TrailingDays = this.computeTrailingDays();
        this.dayRows = this.prepareDataForTableLayout([...this.leadingDays, ...this.days, ...this.TrailingDays], 7);
    }

    private selectMonth(month: string, changeView: boolean = true): void {
        this.selectedDate.month = this.months.indexOf(month);
        if (this.view == VIEW_DAY || this.view == VIEW_MONTH && changeView) this.refreshDates();
        if (changeView) this.view = VIEW_DAY;
    }

    private changeMonth(value: number): void {
        let newDate = moment(this.selectedDate).add(value, 'month');
        this.selectedDate.day = newDate.date();
        this.selectedDate.year = newDate.year();
        this.selectMonth(this.months[newDate.month()], false);
    }

    private selectYear(year: number, changeView: boolean = true): void {
        this.selectedDate.year = year;
        if (this.view == VIEW_DAY) this.refreshDates();
        if (changeView) this.view = VIEW_MONTH;
    }

    private changeYear(value: number): void {
        let newDate = moment(this.selectedDate).add(value, 'year');
        this.selectedDate.day = newDate.date();
        this.selectedDate.month = newDate.month();
        this.selectYear(newDate.year(), false);
    }
}

const DatepickerPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DATEPICKER_NAME, MDatepicker);
    }
};

export default DatepickerPlugin;
