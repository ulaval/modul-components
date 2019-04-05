import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupDirectivePlugin from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState } from '../../mixins/input-state/input-state';
import { InputMaxWidth, InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import ModulDate from '../../utils/modul-date/modul-date';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import CalendarPlugin from '../calendar/calendar';
import { DATEPICKER_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import InputStylePlugin from '../input-style/input-style';
import PopupPlugin from '../popup/popup';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import WithRender from './datepicker.html?style=./datepicker.scss';


export type DatePickerSupportedTypes = Date | string | undefined;

@WithRender
@Component({
    mixins: [
        InputState,
        InputLabel,
        InputPopup,
        InputManagement,
        InputWidth,
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
    @Prop({ default: () => { return new ModulDate().subtract(10, 'year'); } })
    public min: DatePickerSupportedTypes;
    @Prop({ default: () => { return new ModulDate().add(10, 'year'); } })
    public max: DatePickerSupportedTypes;
    @Prop({ default: () => Vue.prototype.$i18n.translate('m-datepicker:placeholder') })
    public placeholder: string;
    @Prop({ default: InputMaxWidth.Small })
    public maxWidth: string;

    private internalOpen: boolean = false;
    private selectedYear: number = 0;
    private selectedMonth: number = 0;
    private selectedDay: number = 0;

    private internalCalandarErrorMessage: string = '';
    private id: string = `mDatepicker-${uuid.generate()}`;

    @Emit('blur')
    public onBlur(): void { }

    protected created(): void {
        moment.locale([this.$i18n.currentLang(), 'en-ca']);
    }

    private inputOnKeydownDelete(): void {
        this.$emit('change', '');
    }

    private get formattedDate(): string {
        return this.value ? moment(this.value).format(this.format) : '';
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

    private get minDateString(): string {
        return moment(this.min).format('Y-M-D');
    }

    private get maxDateString(): string {
        return moment(this.max).format('Y-M-D');
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

    private selectDate(selectedDate: DatePickerSupportedTypes): void {
        this.internalCalandarErrorMessage = '';
        this.$emit('change', this.createModelUpdateValue(selectedDate));
        this.open = false;
    }

    private createModelUpdateValue(newValue: DatePickerSupportedTypes): DatePickerSupportedTypes {
        if (newValue && newValue instanceof Date) {
            return new Date(newValue);
        } else {
            return newValue;
        }
    }

    private setSelectionToCurrentValue(): void {
        const value: DatePickerSupportedTypes = this.value || this.getDefaultCurrentValue();

        if (value instanceof Date) {
            this.selectedYear = value.getFullYear();
            this.selectedMonth = value.getMonth();
            this.selectedDay = value.getDate();
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
        v.use(CalendarPlugin);
        v.component(DATEPICKER_NAME, MDatepicker);
    }
};

export default DatepickerPlugin;
