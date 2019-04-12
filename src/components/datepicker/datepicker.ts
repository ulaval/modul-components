import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupDirectivePlugin from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState } from '../../mixins/input-state/input-state';
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
    public required: boolean;
    @Prop({ default: 'YYYY/MM/DD' })
    public format: string;
    @Prop({ default: () => { return new ModulDate().subtract(10, 'year'); } })
    public min: DatePickerSupportedTypes;
    @Prop({ default: () => { return new ModulDate().add(10, 'year'); } })
    public max: DatePickerSupportedTypes;
    @Prop({ default: () => Vue.prototype.$i18n.translate('m-datepicker:placeholder') })
    public placeholder: string;

    private internalOpen: boolean = false;

    private internalCalandarErrorMessage: string = '';

    private inputModel = '';
    private internalDateModel = '';

    private id: string = `mDatepicker-${uuid.generate()}`;


    protected created(): void {

        if (this.value instanceof Date) {
            this.$log.warn('The type date for datepicker will be deprecated in 1.0, please use a string with the format "YYYY-MM-DD". Using the Date object can lead to timezone issue in your projet see -> https://stackoverflow.com/questions/29174810/javascript-date-timezone-issue');
        }
    }

    private inputOnKeydownDelete(): void {
        this.$emit('change', '');
    }

    private get formattedDate(): string {
        return this.convertToIsoString(this.model);
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
        return this.convertToIsoString(this.min);
    }

    private get maxDateString(): string {
        return this.convertToIsoString(this.max);
    }

    private get minModulDate(): ModulDate {
        return new ModulDate(this.min);
    }

    private get maxModulDate(): ModulDate {
        return new ModulDate(this.max);
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
        inputEl.setSelectionRange(0, this.model.length);
    }

    @Emit('close')
    private onClose(): void { }

    private selectDate(selectedDate: DatePickerSupportedTypes): void {
        this.internalCalandarErrorMessage = '';
        this.model = this.convertToIsoString(selectedDate);
        this.emitChange();
        this.open = false;
    }

    private createModelUpdateValue(newValue: DatePickerSupportedTypes): DatePickerSupportedTypes {
        if (newValue && newValue instanceof Date) {
            return new Date(newValue);
        } else {
            return newValue;
        }
    }


    private validateDate(inputValue: string, emit = true): void {

        this.inputModel = inputValue;

        if (inputValue === '' || inputValue === undefined || inputValue === null) {
            if (this.required) {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:required-error');
            } else {
                this.model = '';
                if (emit) {
                    this.emitChange();
                }
                this.internalCalandarErrorMessage = '';
            }
        } else if (this.validateDateFormat(inputValue)) {
            let newDate: ModulDate = new ModulDate(inputValue);
            if (newDate.isBetween(this.minModulDate, this.maxModulDate)) {
                // set the model with default value
                this.model = inputValue;
                if (emit) {
                    this.emitChange();
                }
                this.internalCalandarErrorMessage = '';
            } else {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:out-of-range-error');
            }
        } else {
            this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:format-error');
        }
    }


    @Watch('value', { immediate: true })
    private onValueChange(value: DatePickerSupportedTypes): void {
        if (value instanceof Date) {
            this.validateDate(new Date(value).toISOString(), false);
        } else {
            this.validateDate(value as string, false);
        }
    }

    private set model(value: string) {
        this.internalDateModel = value;
        this.inputModel = value;

    }

    public emitChange(): void {
        // tslint:disable-next-line: no-console
        console.log('change = ' + this.createModelUpdateValue(this.internalDateModel));
        this.$emit('change', this.createModelUpdateValue(this.internalDateModel));
    }

    private get model(): string {
        return this.internalDateModel;
    }

    private convertToIsoString(input: DatePickerSupportedTypes): string {
        if (input) {
            try {
                return new ModulDate(input).toString();
            } catch (err) {
                // invalid date
            }
            return '';
        }
        return '';
    }

    private validateDateFormat(dateString: string): boolean {
        if (dateString) {
            try {
                new ModulDate(dateString).toString();
                return true;
            } catch (err) {
                // invalid date
            }
            return false;
        }
        return false;
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
