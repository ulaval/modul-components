import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupDirectivePlugin from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
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
            this.$log.warn('Using a Date as value for datepicker is not recommended and will be deprecated in 1.0, the value should use a string with the format "YYYY-MM-DD". Using a Date object can lead to timezone issue in your projet see -> https://stackoverflow.com/questions/29174810/javascript-date-timezone-issue');
        }
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

    private set open(open: boolean) {
        if (this.as<InputState>().active) {
            this.internalOpen = open;
        }
    }


    @Emit('close')
    private async onClose(): Promise<void> {

        // emit blur if not focus and still open
        if (!this.as<InputManagement>().internalIsFocus) {
            this.$emit('blur');
        }

    }

    @Emit('open')
    private async onOpen(): Promise<void> {
        await this.$nextTick();
        let inputEl: any = this.$refs.input;
        inputEl.focus();
        inputEl.setSelectionRange(0, this.inputModel.length);
    }



    private async selectDate(selectedDate: DatePickerSupportedTypes): Promise<void> {
        this.internalCalandarErrorMessage = '';
        this.model = this.convertToIsoString(selectedDate);
        this.open = false;
    }

    private createModelUpdateValue(newValue: DatePickerSupportedTypes): DatePickerSupportedTypes {
        if (newValue && this.value instanceof Date) {
            return new Date(newValue);
        } else {
            return newValue;
        }
    }

    private inputDate(inputValue: string): void {
        if (inputValue === '') {
            // clear the value
            this.model = '';
            this.showErrorMessage(inputValue);
        } else {
            this.inputModel = this.model;
            //TODO ! not implemented
        }
        //   this.inputModel = inputValue;
        //   this.open = false;

    }

    private toggleOpen(): void {
        this.open = !this.open;
    }

    private showErrorMessage(inputValue: string): boolean {
        if (inputValue === '' || inputValue === undefined || inputValue === null) {
            if (this.required) {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:required-error');
                return false;
            } else {
                this.internalCalandarErrorMessage = '';
                return true;
            }
        } else if (this.validateDateFormat(inputValue)) {
            let newDate: ModulDate = new ModulDate(inputValue);
            if (newDate.isBetween(this.minModulDate, this.maxModulDate)) {
                this.internalCalandarErrorMessage = '';
                return true;
            } else {
                this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:out-of-range-error');
                return false;
            }
        } else {
            this.internalCalandarErrorMessage = this.$i18n.translate('m-datepicker:format-error');
            return false;
        }

        return true;
    }


    // Model management

    // override from InputManagement
    @Watch('value', { immediate: true })
    private onValueChange(value: DatePickerSupportedTypes): void {
        if (value) {
            if (value instanceof Date) {
                this.internalDateModel = new ModulDate(value.toISOString()).toString();

            } else {
                this.internalDateModel = value;
            }
        } else {
            this.internalDateModel = '';
        }

        this.inputModel = this.internalDateModel;
        this.showErrorMessage(this.inputModel);
    }

    // override from InputManagement
    private set model(value: string) {
        this.internalDateModel = value;
        this.inputModel = this.internalDateModel;
        this.emitChange();
    }

    public emitChange(): void {
        console.log('change emmited = ' + this.createModelUpdateValue(this.internalDateModel));
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


    // Focus management.

    // override from InputManagement
    private onFocus(event: FocusEvent): void {
        if (!this.open) { // open on focus
            this.open = true;
        }

        this.as<InputManagement>().internalIsFocus = this.as<InputStateMixin>().active;
        if (this.as<InputManagement>().internalIsFocus) {
            this.$emit('focus', event);
        }
    }

    // override from InputManagement
    private onBlur(event: Event): void {
        this.as<InputManagement>().internalIsFocus = false;

        if (!this.open) { // do not emit blur if still open
            this.$emit('blur', event);
        }
    }

    // override from Input-management
    private get isFocus(): boolean {
        return this.as<InputManagement>().internalIsFocus || this.open;
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
