import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupDirectivePlugin from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState } from '../../mixins/input-state/input-state';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { DATEPICKER_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import InputStylePlugin from '../input-style/input-style';
import PopupPlugin from '../popup/popup';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import WithRender from './datepicker.html?style=./datepicker.scss';


const VIEW_DAY: string = 'day';
const VIEW_MONTH: string = 'month';
const VIEW_YEAR: string = 'year';
const NB_YEARS_PER_ROW: number = 5;
const ITEM_DIMENSION: number = 40;

interface DatepickerDateDisplay extends DatepickerDate {
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
}

interface DatepickerDate {
    date: number;
    month: number;
    year: number;
}

export type DatePickerSupportedTypes = moment.Moment | Date | string | undefined;

@WithRender
@Component({
    mixins: [
        InputState,
        InputLabel,
        InputPopup,
        InputManagement,
        MediaQueries
    ]
})
export class MDatepicker extends ModulVue {

    @Model('change')
    @Prop()
    public value: DatePickerSupportedTypes;
    @Prop()
    public label: string;
    @Prop()
    public iconName: string;
    @Prop()
    public required: boolean;
    @Prop({ default: 'YYYY/MM/DD' })
    public format: string;
    @Prop({ default: () => { return moment().subtract(10, 'year'); } })
    public min: DatePickerSupportedTypes;
    @Prop({ default: () => { return moment().add(10, 'year'); } })
    public max: DatePickerSupportedTypes;
    @Prop({ default: () => (Vue.prototype as any).$i18n.translate('m-datepicker:placeholder') })
    public placeholder: string;

    private internalOpen: boolean = false;
    private view: string = 'day';
    private previousDays: DatepickerDateDisplay[] = [];
    private days: DatepickerDateDisplay[] = [];
    private nextDays: DatepickerDateDisplay[] = [];
    private selectedYear: number = 0;
    private selectedMonth: number = 0;
    private selectedDay: number = 0;

    private mouseIsDown: boolean = false;
    private internalCalandarErrorMessage: string = '';
    private id: string = `mDatepicker-${uuid.generate()}`;

    @Emit('blur')
    public onBlur(event: Event): void { }

    protected created(): void {
        moment.locale([this.$i18n.currentLang(), 'en-ca']);
    }

    private valueIsValid(): boolean {
        return !!this.value && moment(this.value).isValid() && moment(this.value).isBetween(this.min, this.max, 'day', '[]');
    }

    private get years(): number[] {
        let years: number[] = [];
        for (let year: number = moment(this.max).year(); year >= moment(this.min).year(); year--) {
            years.push(year);
        }
        return this.prepareDataForTableLayout(years, NB_YEARS_PER_ROW);
    }

    private get months(): any[] {
        let months: any[] = [];
        for (let index: number = 0; index <= 11; index++) {
            months.push({
                index,
                name: moment.monthsShort()[index],
                isDisabled: !moment({ year: this.selectedMomentDate.year(), month: index }).isBetween(this.min, this.max, 'month', '[]')
            });
        }
        return this.prepareDataForTableLayout(months, 3);
    }

    private get weekdays(): string[] {
        return moment.weekdaysMin();
    }

    private inputOnKeydownDelete(): void {
        this.$emit('change', '');
    }

    private getDaysOfPreviousMonth(): DatepickerDateDisplay[] {
        let monthStartsAt: number = moment(this.selectedMomentDate).startOf('month').weekday();
        let days: DatepickerDateDisplay[] = [];

        for (let index: number = monthStartsAt; index > 0; index--) {
            let date: moment.Moment = moment(this.selectedMomentDate).startOf('month').subtract(index, 'days');
            days.push({
                date: date.date(),
                month: date.month(),
                year: date.year(),
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day'),
                isToday: false,
                isSelected: false
            });
        }
        return days;
    }

    private getDaysOfCurrentMonth(): DatepickerDateDisplay[] {
        let lastDayOfMonth: number = this.selectedMomentDate.daysInMonth();
        let days: DatepickerDateDisplay[] = [];

        for (let index: number = 1; index <= lastDayOfMonth; index++) {
            let date: any = { year: this.selectedMomentDate.year(), month: this.selectedMomentDate.month(), date: index };
            days.push({
                ...date,
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day'),
                isToday: moment().isSame(date, 'day'),
                isSelected: this.value && this.selectedMomentDate.isSame(date, 'day')
            });
        }
        return days;
    }

    private getDaysOfNextMonth(): DatepickerDateDisplay[] {
        let daysToDisplayFromNextMonth: number = 6 - moment(this.selectedMomentDate).endOf('month').weekday();
        let days: DatepickerDateDisplay[] = [];

        for (let index: number = 1; index <= daysToDisplayFromNextMonth; index++) {
            let date: moment.Moment = moment(this.selectedMomentDate).endOf('month').add(index, 'days');
            days.push({
                date: date.date(),
                month: date.month(),
                year: date.year(),
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day'),
                isToday: false,
                isSelected: false
            });
        }
        return days;
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

    private get formattedDate(): string {
        return this.value ? moment(this.value).format(this.format) : '';
    }

    private get selectedMomentDate(): moment.Moment {
        return moment({ year: this.selectedYear, month: this.selectedMonth, day: this.selectedDay });
    }

    private get isMinYear(): boolean {
        return this.selectedMomentDate.isSameOrBefore(this.min, 'year');
    }

    private get isMaxYear(): boolean {
        return this.selectedMomentDate.isSameOrAfter(this.max, 'year');
    }

    private get isMinMonth(): boolean {
        return this.selectedMomentDate.isSameOrBefore(this.min, 'month');
    }

    private get isMaxMonth(): boolean {
        return this.selectedMomentDate.isSameOrAfter(this.max, 'month');
    }

    private get selectedMonthName(): string {
        return moment().month(this.selectedMonth).format('MMM');
    }

    private get daysOfMonth(): DatepickerDateDisplay[] {
        this.previousDays = this.getDaysOfPreviousMonth();
        this.days = this.getDaysOfCurrentMonth();
        this.nextDays = this.getDaysOfNextMonth();
        return this.prepareDataForTableLayout([...this.previousDays, ...this.days, ...this.nextDays], 7);
    }

    private get calandarError(): boolean {
        return this.internalCalandarErrorMessage !== '' || this.as<InputState>().hasError;
    }

    private get calandarErrorMessage(): string {
        return this.as<InputState>().errorMessage !== undefined ? this.as<InputState>().errorMessage : this.internalCalandarErrorMessage;
    }

    private get open(): boolean {
        return this.internalOpen;
    }

    private get ariaControls1(): string {
        return this.id + '-controls-1';
    }

    private get ariaControls2(): string {
        return this.id + '-controls-2';
    }

    @Watch('focus')
    private updateFocus(): void {
        this.open = this.as<InputManagement>().focus;
    }

    private set open(open: boolean) {
        if (this.as<InputState>().active) {
            this.internalOpen = open;
        }
    }

    @Emit('open')
    private async onOpen(): Promise<void> {
        await this.$nextTick();
        let inputEl: any = this.$refs.input;
        inputEl.focus();
        inputEl.setSelectionRange(0, this.formattedDate.length);
        this.setSelectionToCurrentValue();
    }

    @Emit('close')
    private onClose(): void { }

    private validateDate(event): void {
        if (event.target.value === '') {
            if (this.required) {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:required-error');
            } else {
                this.$emit('change', '');
                this.internalCalandarErrorMessage = '';
            }
        } else if (moment(event.target.value, this.format).isValid()) {
            let newDate: moment.Moment = moment(event.target.value, this.format);
            if (newDate.isBetween(this.min, this.max, 'day', '[]')) {
                this.$emit('change', newDate);
                this.internalCalandarErrorMessage = '';
            } else {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:out-of-range-error');
            }
        } else {
            this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:format-error');
        }
    }

    private showYears(): void {
        this.view = VIEW_YEAR;
        let scrollTop: number = (Math.floor((moment(this.max).year() - this.selectedYear) / NB_YEARS_PER_ROW)) * ITEM_DIMENSION - (3 * ITEM_DIMENSION);
        setTimeout(() => {
            (this.$refs.body as Element).scrollTo(0, scrollTop);
        }, 10);
    }

    private selectYear(year: number, showMonths: boolean = false): void {
        this.selectedYear = year;
        if (showMonths) {
            this.view = VIEW_MONTH;
        }
    }

    private selectMonth(month: number, showDays: boolean = false): void {
        if (month === 12) {
            this.selectedMonth = 0;
            this.selectedYear++;
        } else {
            this.selectedMonth = month;
        }

        if (showDays) {
            this.view = VIEW_DAY;
        }
    }

    private selectDate(selectedDate: DatepickerDateDisplay): void {
        if (!selectedDate.isDisabled) {
            this.internalCalandarErrorMessage = '';
            this.$emit('change', this.createModelUpdateValue(selectedDate));
            this.open = false;
        }
    }

    private createModelUpdateValue(newValue: DatepickerDate): DatePickerSupportedTypes {
        if (this.value instanceof Date) {
            return new Date(newValue.year, newValue.month, newValue.date);
        } else if (this.value instanceof moment) {
            return moment({ year: this.selectedYear, month: this.selectedMonth, day: this.selectedDay });
        } else {
            return new Date(newValue.year, newValue.month, newValue.date).toISOString();
        }
    }

    private setSelectionToCurrentValue(): void {
        const value: DatePickerSupportedTypes = this.value || this.getDefaultCurrentValue();

        if (value instanceof Date) {
            this.selectedYear = value.getFullYear();
            this.selectedMonth = value.getMonth();
            this.selectedDay = value.getDate();
        } else if (value instanceof moment) {
            this.selectedYear = moment(value).get('year');
            this.selectedMonth = moment(value).get('month');
            this.selectedDay = moment(value).get('day');
        } else {
            const dateValue: Date = new Date(value as string);
            this.selectedYear = dateValue.getFullYear();
            this.selectedMonth = dateValue.getMonth();
            this.selectedDay = dateValue.getDate();
        }
    }

    private getDefaultCurrentValue(): DatePickerSupportedTypes {
        if (moment(this.min).isAfter(moment(new Date()))) {
            return this.min;
        } else {
            return new Date();
        }
    }
}

const DatepickerPlugin: PluginObject<any> = {
    install(v): void {
        v.use(InputStylePlugin);
        v.use(ButtonPlugin);
        v.use(IconButtonPlugin);
        v.use(PopupPlugin);
        v.use(ValidationMessagePlugin);
        v.use(MediaQueriesPlugin);
        v.use(PopupDirectivePlugin);
        v.component(DATEPICKER_NAME, MDatepicker);
    }
};

export default DatepickerPlugin;
