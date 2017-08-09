import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './datepicker.html?style=./datepicker.scss';
import { DATEPICKER_NAME } from '../component-names';
import * as moment from 'moment';
import { curLang } from '../../utils/i18n/i18n';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';

const VIEW_DAY = 'day';
const VIEW_MONTH = 'month';
const VIEW_YEAR = 'year';

export interface DatepickerDate {
    day: number;
    month: number;
    year: number;
    isDisabled: boolean;
}

export interface DatepickerMonth {
    name: string;
    index: number;
    isDisabled: boolean;
}

@WithRender
@Component({
    mixins: [InputState]
})
export class MDatepicker extends ModulVue implements InputStateMixin {

    @Prop({ default: () => { return moment(); } })
    public value: moment.Moment;
    @Prop({ default: 'L' })
    public format: string;
    @Prop({ default: () => { return moment().subtract(10, 'year'); } })
    public min: moment.Moment;
    @Prop({ default: () => { return moment().add(10, 'year'); } })
    public max: moment.Moment;
    @Prop({ default: () => ({ placement: 'bottom-start' }) })
    public options: any;
    @Prop()
    public disabled: boolean;

    // Variables from InputStateMixin
    public hasError: boolean;
    public isDisabled: boolean;
    public isValid: boolean;

    public componentName: string = DATEPICKER_NAME;

    private view: string = 'day';
    private selectedDate: DatepickerDate = { day: 0, month: 0, year: 0, isDisabled: false };
    private formattedDate: string = '';
    private weekdays: string[] = [];
    private months: DatepickerMonth[] = [];
    private years: number[] = [];
    private leadingDays: DatepickerDate[] = [];
    private days: DatepickerDate[] = [];
    private TrailingDays: DatepickerDate[] = [];
    private yearRows: any[] = [];
    private monthRows: any[] = [];
    private dayRows: any[] = [];
    private error: string = '';
    private placeholder: string = this.$i18n.translate('m-datepicker:placeholder');
    private openCalendarDesc: string = this.$i18n.translate('m-datepicker:open-calendar-desc');
    private closeCalendarDesc: string = this.$i18n.translate('m-datepicker:close-calendar-desc');
    private isOpen: boolean = false;

    private created(): void {
        moment.locale(curLang);
        this.formattedDate = this.value.format(this.format);
        this.weekdays = moment.weekdaysMin();
        this.selectedDate.day = this.value.date();
        this.selectedDate.month = this.value.month();
        this.selectedDate.year = this.value.year();

        for (let year = this.min.year(); year <= this.max.year(); year++) {
            this.years.push(year);
        }

        for (let index = 0; index <= 11; index++) {
            this.months.push({ index, name: moment.monthsShort()[index], isDisabled: false });
        }

        this.setMonths();
        this.setDays();

        this.yearRows = this.prepareDataForTableLayout(this.years, 5);
        this.monthRows = this.prepareDataForTableLayout(this.months, 3);
    }

    private setMonths() {
        for (let index = 0; index <= 11; index++) {
            this.months[index].isDisabled = !moment({ year: this.selectedDate.year, month: index }).isBetween(this.min, this.max, 'month', '[]');
        }
    }

    private setDays(): void {
        this.leadingDays = this.getSelectedMonthPreviousDays();
        this.days = this.getSelectedMonthDays();
        this.TrailingDays = this.getSelectedMonthNextDays();
        this.dayRows = this.prepareDataForTableLayout([...this.leadingDays, ...this.days, ...this.TrailingDays], 7);
    }

    private getSelectedMonthPreviousDays(): DatepickerDate[] {
        let monthStartsAt = moment(this.selectedDate).startOf('month').weekday();
        let days: DatepickerDate[] = [];

        for (let index = monthStartsAt; index > 0; index--) {
            let date = moment(this.selectedDate).startOf('month').subtract(index, 'days');
            days.push({
                day: date.date(),
                month: date.month(),
                year: date.year(),
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day')
            });
        }
        return days;
    }

    private getSelectedMonthDays(): DatepickerDate[] {
        let lastDayOfMonth: number = moment(this.selectedDate).daysInMonth();
        let days: DatepickerDate[] = [];

        for (let index = 1; index <= lastDayOfMonth; index++) {
            let date = { day: index, month: this.selectedDate.month, year: this.selectedDate.year };
            days.push({
                ...date,
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day')
            });

        }
        return days;
    }

    private getSelectedMonthNextDays(): DatepickerDate[] {
        let daysToDisplayFromNextMonth = 6 - moment(this.selectedDate).endOf('month').weekday();
        let days: DatepickerDate[] = [];

        for (let index = 1; index <= daysToDisplayFromNextMonth; index++) {
            let date = moment(this.selectedDate).endOf('month').add(index, 'days');
            days.push({
                day: date.date(),
                month: date.month(),
                year: date.year(),
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day')
            });
        }
        return days;
    }

    private prepareDataForTableLayout(data: any[], nbItemPerRow: number): any[] {
        let nbRow: number = Math.ceil(data.length / nbItemPerRow);
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

    private get isMinYear(): boolean {
        return this.selectedDate.year <= this.min.year();
    }

    private get isMaxYear(): boolean {
        return this.selectedDate.year >= this.max.year();
    }

    private get isMinMonth(): boolean {
        return moment(this.selectedDate).isSameOrBefore(this.min, 'month');
    }

    private get isMaxMonth(): boolean {
        return moment(this.selectedDate).isSameOrAfter(this.max, 'month');
    }

    private get monthName(): string {
        return this.months[this.selectedDate.month].name;
    }

    private isSelectedDate(date: DatepickerDate): boolean {
        return moment(date).isSame(this.selectedDate, 'day');
    }

    private isInSelectedMonth(date: DatepickerDate): boolean {
        return date.month == this.selectedDate.month;
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

    private onChange(event, value) {
        let newDate = moment(value);
        if (newDate.isValid()) {
            if (newDate.isBetween(this.min, this.max, 'day', '[]')) {
                this.selectedDate = {
                    day: newDate.date(),
                    month: newDate.month(),
                    year: newDate.year(),
                    isDisabled: false
                };
                this.setDays();
                this.$emit('change', newDate);
                this.error = '';
            } else {
                this.error = this.$i18n.translate('m-datepicker:out-of-bounds-error');
            }
        } else {
            this.error = this.$i18n.translate('m-datepicker:format-error');
        }
        this.closeDatepicker();
    }

    private selectYear(year: number, showMonths: boolean = false): void {
        let newDate = moment(this.selectedDate).year(year);
        this.selectedDate.day = newDate.date();
        this.selectedDate.month = newDate.month();
        this.selectedDate.year = newDate.year();
        if (moment(this.selectedDate).isBefore(this.min, 'day')) {
            this.selectedDate.day = this.min.date();
            this.selectedDate.month = this.min.month();
        }
        if (moment(this.selectedDate).isAfter(this.max, 'day')) {
            this.selectedDate.day = this.max.date();
            this.selectedDate.month = this.max.month();
        }
        this.setMonths();
        if (showMonths) {
            this.view = VIEW_MONTH;
        } else {
            this.setDays();
        }
    }

    private selectMonth(month: number): void {
        let newDate = moment(this.selectedDate).month(month);
        this.selectedDate.day = newDate.date();
        this.selectedDate.month = newDate.month();
        this.setDays();
        this.view = VIEW_DAY;
    }

    private changeMonth(value: number): void {
        let newDate = moment(this.selectedDate).add(value, 'month');
        this.selectedDate.day = newDate.date();
        this.selectedDate.month = newDate.month();
        if (this.selectedDate.year != newDate.year()) {
            this.selectedDate.year = newDate.year();
            this.setMonths();
        }
        if (this.view == VIEW_DAY) this.setDays();
    }

    private selectDate(selectedDate: DatepickerDate): void {
        if (!selectedDate.isDisabled) {
            this.selectedDate = selectedDate;
            this.setDays();
            this.$emit('change', moment(this.selectedDate));
            this.closeDatepicker();
            this.error = '';
        }
    }
}

const DatepickerPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DATEPICKER_NAME, MDatepicker);
    }
};

export default DatepickerPlugin;
