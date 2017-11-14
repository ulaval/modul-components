import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './datepicker.html?style=./datepicker.scss';
import { DATEPICKER_NAME } from '../component-names';
import * as moment from 'moment';
import { curLang } from '../../utils/i18n/i18n';
import { InputState } from '../../mixins/input-state/input-state';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { KeyCode } from '../../utils/keycode/keycode';
import PopupPlugin from '../popup/popup';
import TextFieldPlugin from '../text-field/text-field';
import ButtonPlugin from '../button/button';

const VIEW_DAY = 'day';
const VIEW_MONTH = 'month';
const VIEW_YEAR = 'year';
const NB_YEARS_PER_ROW = 5;
const ITEM_DIMENSION = 40;

export interface DatepickerDate {
    date: number;
    month: number;
    year: number;
    isDisabled: boolean;
    isToday: boolean;
    isSelected: boolean;
}

@WithRender
@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class MDatepicker extends ModulVue {

    @Model('change')
    @Prop()
    public value: moment.Moment | Date;
    @Prop()
    public label: string;
    @Prop()
    public iconName: boolean;
    @Prop({ default: false })
    public required: boolean;
    @Prop({ default: 'DD/MM/Y' })
    public format: string;
    @Prop({ default: () => { return moment().subtract(10, 'year'); } })
    public min: moment.Moment | Date;
    @Prop({ default: () => { return moment().add(10, 'year'); } })
    public max: moment.Moment | Date;

    private internalOpen: boolean = false;
    private view: string = 'day';
    private internalValue = '';
    private placeholder: string = this.$i18n.translate('m-datepicker:placeholder');
    private previousDays: DatepickerDate[] = [];
    private days: DatepickerDate[] = [];
    private nextDays: DatepickerDate[] = [];
    private selectedYear: number = 0;
    private selectedMonth: number = 0;
    private selectedDay: number = 0;

    private mouseIsDown: boolean = false;
    private internalCalandarErrorMessage: string = '';

    protected created(): void {
        moment.locale([curLang, 'en-ca']);
        this.selectedMomentDate = this.valueIsValid() ? moment(this.value) : moment();
    }

    private valueIsValid(): boolean {
        return this.value && moment(this.value).isValid() && moment(this.value).isBetween(this.min, this.max, 'day', '[]');
    }

    private get years(): number[] {
        let years: number[] = [];
        for (let year = moment(this.max).year(); year >= moment(this.min).year(); year--) {
            years.push(year);
        }
        return this.prepareDataForTableLayout(years, NB_YEARS_PER_ROW);
    }

    private get months(): any[] {
        let months: any[] = [];
        for (let index = 0; index <= 11; index++) {
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

    private getDaysOfPreviousMonth(): DatepickerDate[] {
        let monthStartsAt = moment(this.selectedMomentDate).startOf('month').weekday();
        let days: DatepickerDate[] = [];

        for (let index = monthStartsAt; index > 0; index--) {
            let date = moment(this.selectedMomentDate).startOf('month').subtract(index, 'days');
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

    private getDaysOfCurrentMonth(): DatepickerDate[] {
        let lastDayOfMonth: number = this.selectedMomentDate.daysInMonth();
        let days: DatepickerDate[] = [];

        for (let index = 1; index <= lastDayOfMonth; index++) {
            let date = { year: this.selectedMomentDate.year(), month: this.selectedMomentDate.month(), date: index };
            days.push({
                ...date,
                isDisabled: moment(date).isBefore(this.min, 'day') || moment(date).isAfter(this.max, 'day'),
                isToday: moment().isSame(date, 'day'),
                isSelected: this.selectedMomentDate.isSame(date, 'day')
            });
        }
        return days;
    }

    private getDaysOfNextMonth(): DatepickerDate[] {
        let daysToDisplayFromNextMonth = 6 - moment(this.selectedMomentDate).endOf('month').weekday();
        let days: DatepickerDate[] = [];

        for (let index = 1; index <= daysToDisplayFromNextMonth; index++) {
            let date = moment(this.selectedMomentDate).endOf('month').add(index, 'days');
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

    private get formattedDate(): string {
        return this.internalCalandarErrorMessage || !this.value ? this.internalValue : moment(this.internalValue).format(this.format);
    }

    private set formattedDate(value: string) {
        this.internalValue = value;
    }

    private get selectedMomentDate(): moment.Moment {
        return this.selectedDay ? moment({ year: this.selectedYear, month: this.selectedMonth, day: this.selectedDay }) : moment();
    }

    private set selectedMomentDate(value: moment.Moment) {
        this.selectedYear = value.year();
        this.selectedMonth = value.month();
        this.selectedDay = value.date();
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

    private get daysOfMonth(): DatepickerDate[] {
        this.previousDays = this.getDaysOfPreviousMonth();
        this.days = this.getDaysOfCurrentMonth();
        this.nextDays = this.getDaysOfNextMonth();
        return this.prepareDataForTableLayout([...this.previousDays, ...this.days, ...this.nextDays], 7);
    }

    private get calandarError(): boolean {
        return this.internalCalandarErrorMessage != '' || this.as<InputState>().hasError;
    }

    private get calandarErrorMessage(): string {
        return this.as<InputState>().errorMessage != undefined ? this.as<InputState>().errorMessage : this.internalCalandarErrorMessage;
    }

    private get isEmpty(): boolean {
        return this.hasValue() || (this.hasPlaceholder() && this.open) ? false : true;
    }

    private hasValue(): boolean {
        return this.formattedDate != undefined && this.formattedDate != '';
    }

    private hasPlaceholder(): boolean {
        return this.placeholder != undefined && this.placeholder != '';
    }

    private get open(): boolean {
        return this.internalOpen;
    }

    private set open(open: boolean) {
        this.internalOpen = open;
        this.$nextTick(() => {
            if (this.internalOpen) {
                let inputEl: any = this.$refs.input;
                inputEl.focus();
                inputEl.setSelectionRange(0, this.formattedDate.length);
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    private onMousedown(event): void {
        this.mouseIsDown = true;
    }

    private onMouseup(event): void {
        setTimeout(() => {
            this.mouseIsDown = false;
        }, 30);
    }

    private onKeydownEnter($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        }
    }

    private onKeydownTab(): void {
        if (!this.mouseIsDown && this.as<MediaQueries>().isMqMinS) {
            this.open = false;
        }
    }

    private onKeydown($event: KeyboardEvent): void {
        if ($event.keyCode != KeyCode.M_RETURN &&
            $event.keyCode != KeyCode.M_ENTER &&
            $event.keyCode != KeyCode.M_TAB &&
            $event.keyCode != KeyCode.M_ESCAPE && !this.open) {
            this.open = true;
        }
    }

    private onFocus(): void {
        if (!this.mouseIsDown && !this.open && !this.as<InputState>().isDisabled && this.as<MediaQueries>().isMqMinS) {
            setTimeout(() => {
                this.open = true;
            }, 300);
        }
    }

    private onBlur(event): void {
        if (event.target.value == '') {
            this.selectedMomentDate = moment();
            if (this.required) {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:required-error');
            } else {
                this.$emit('change', '');
                this.internalCalandarErrorMessage = '';
            }
        } else if (moment(event.target.value, this.format).isValid()) {
            let newDate = moment(event.target.value, this.format);
            if (newDate.isBetween(this.min, this.max, 'day', '[]')) {
                this.selectedMomentDate = newDate;
                this.formattedDate = this.selectedMomentDate.format(this.format);
                this.$emit('change', newDate);
                this.internalCalandarErrorMessage = '';
            } else {
                this.formattedDate = newDate.format(this.format);
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:out-of-range-error');
            }
        } else {
            this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:format-error');
        }
    }

    private onOpen(): void {
        if (!this.open) {
            this.open = true;
        }
    }

    private onClose(): void {
        if (this.open) {
            this.open = false;
        }
    }

    private keepDateInRange(date: moment.Moment): moment.Moment {
        if (date.isBefore(this.min, 'day')) {
            return moment(this.min);
        } else if (date.isAfter(this.max, 'day')) {
            return moment(this.max);
        }
        return date;
    }

    private showYears() {
        this.view = VIEW_YEAR;
        let scrollTop = (Math.floor((moment(this.max).year() - this.selectedYear) / NB_YEARS_PER_ROW)) * ITEM_DIMENSION - (3 * ITEM_DIMENSION);
        setTimeout(() => {
            (this.$refs.body as Element).scrollTo(0, scrollTop);
        }, 10);
    }

    private selectYear(year: number, showMonths: boolean = false): void {
        this.selectedMomentDate = this.keepDateInRange(moment(this.selectedMomentDate).year(year));
        if (showMonths) this.view = VIEW_MONTH;
    }

    private selectMonth(month: number, showDays: boolean = false): void {
        this.selectedMomentDate = this.keepDateInRange(moment(this.selectedMomentDate).month(month));
        if (showDays) this.view = VIEW_DAY;
    }

    private selectDate(selectedDate: DatepickerDate): void {
        if (!selectedDate.isDisabled) {
            this.selectedMomentDate = moment(selectedDate);
            this.internalCalandarErrorMessage = '';
            this.formattedDate = this.selectedMomentDate.format(this.format);
            this.$emit('change', this.value instanceof Date ? this.selectedMomentDate.toDate() : this.selectedMomentDate);
            this.open = false;
        }
    }
}

const DatepickerPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(PopupPlugin);
        v.use(TextFieldPlugin);
        v.use(ButtonPlugin);
        v.component(DATEPICKER_NAME, MDatepicker);
    }
};

export default DatepickerPlugin;
