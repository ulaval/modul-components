import { CleaveOptions } from 'cleave.js/options';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupDirectivePlugin from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
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
import { MInputMask } from '../input-mask/input-mask';
import InputStylePlugin from '../input-style/input-style';
import PopupPlugin from '../popup/popup';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import WithRender from './datepicker.html?style=./datepicker.scss';


export type DatePickerSupportedTypes = Date | string | undefined;

@WithRender
@Component({
    components: {
        MInputMask
    },
    mixins: [
        InputState,
        InputLabel,
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

    @Prop({ default: () => { return new ModulDate().subtract(10, 'year'); } })
    public min: DatePickerSupportedTypes;
    @Prop({ default: () => { return new ModulDate().add(10, 'year'); } })
    public max: DatePickerSupportedTypes;
    @Prop({ default: () => Vue.prototype.$i18n.translate('m-datepicker:placeholder') })
    public placeholder: string;
    @Prop({ default: InputMaxWidth.Small })
    public maxWidth: string;

    @Prop({ default: false })
    public hideInternalErrorMessage: boolean;

    private internalOpen: boolean = false;
    private internalCalendarErrorMessage: string = '';
    private inputModel = '';
    private internalDateModel = '';

    private id: string = `mDatepicker-${uuid.generate()}`;

    public $refs: {
        input: MInputMask;
    };

    private get inputOptions(): CleaveOptions {
        return {
            numericOnly: true,
            delimiters: ['-', '-'],
            blocks: [4, 2, 2]
        };
    }

    protected created(): void {

        if (this.value instanceof Date) {
            this.$log.warn('Using a Date as value for datepicker is not recommended and will be deprecated in 1.0, the value should use a string with the format "YYYY-MM-DD". Using a Date object can lead to timezone issue in your projet see -> https://stackoverflow.com/questions/29174810/javascript-date-timezone-issue');
        }
    }



    get formattedDate(): string {
        return this.convertValueToModel(this.model);
    }

    get calandarError(): boolean {
        return this.internalCalendarErrorMessage !== '' || this.as<InputState>().hasError;
    }

    private get calandarErrorMessage(): string {
        if (this.internalCalendarErrorMessage && !this.hideInternalErrorMessage) {
            return this.internalCalendarErrorMessage;
        } else {
            return this.as<InputState>().errorMessage !== undefined ? this.as<InputState>().errorMessage : '';
        }

    }

    private get open(): boolean {
        return this.internalOpen;
    }

    private get minDateString(): string {
        return this.convertValueToModel(this.min);
    }

    private get maxDateString(): string {
        return this.convertValueToModel(this.max);
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
            this.showErrorMessage(this.inputModel);
        }

    }

    @Emit('open')
    private async onOpen(): Promise<void> {
        let inputMask: MInputMask = this.$refs.input;

        this.clearErrorMessage();
        inputMask.focusAndSelectAll();
    }


    private async selectDate(selectedDate: DatePickerSupportedTypes): Promise<void> {
        this.internalCalendarErrorMessage = '';
        this.model = this.convertValueToModel(selectedDate);
        this.inputModel = this.internalDateModel;
        this.open = false;
    }


    private inputDate(inputValue: string): void {
        this.inputModel = inputValue;

        if (!inputValue || inputValue === '') {
            this.model = '';
            this.clearErrorMessage();
        } else if (inputValue.length === 10) {

            if (this.showErrorMessage(inputValue)) {
                this.model = this.inputModel;
            } else {
                this.model = '';
            }
        } else {
            if (this.open) {
                this.open = false;
            }
            this.model = '';
            this.clearErrorMessage();
        }
    }

    private clearErrorMessage(): void {
        this.internalCalendarErrorMessage = '';
    }

    private showErrorMessage(inputValue: string): boolean {
        if (inputValue === '' || inputValue === undefined || inputValue === null) {

            this.internalCalendarErrorMessage = '';
            return true;

        } else if (inputValue.length === 10 && this.validateDateFormat(inputValue)) {
            let newDate: ModulDate = new ModulDate(inputValue);
            if (newDate.isBetween(this.minModulDate, this.maxModulDate)) {
                this.internalCalendarErrorMessage = '';
                return true;
            } else {
                this.internalCalendarErrorMessage = this.$i18n.translate('m-datepicker:out-of-range-error');
                return false;
            }
        } else {
            this.internalCalendarErrorMessage = this.$i18n.translate('m-datepicker:format-error');
            return false;
        }

        return true;
    }


    // Model management

    // override from InputManagement
    @Watch('value', { immediate: true })
    private onValueChange(value: DatePickerSupportedTypes): void {

        if (this.internalDateModel !== this.convertModelToString(value)) {
            this.internalDateModel = this.convertModelToString(value);
            this.inputModel = this.internalDateModel;
            this.showErrorMessage(this.inputModel);
        }

    }

    // override from InputManagement
    private set model(value: string) {
        if (this.internalDateModel !== value) {
            this.internalDateModel = value;
            this.emitChange();
        }
    }

    private get model(): string {
        return this.internalDateModel;
    }

    // override from InputManagement
    public get hasValue(): boolean {
        return !!(this.inputModel || '').toString().trim();
    }

    public emitChange(): void {
        this.$emit('change', this.convertStringToModel(this.internalDateModel));
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
    private onClick(event: MouseEvent): void {
        this.as<InputManagement>().internalIsFocus = this.as<InputStateMixin>().active;
        let inputEl: HTMLElement | undefined = this.as<InputStateMixin>().getInput();
        if (this.as<InputManagement>().internalIsFocus && inputEl) {
            inputEl.focus();
        }
        this.$emit('click');
    }

    // override from InputManagement
    private onBlur(event: Event): void {
        this.as<InputManagement>().internalIsFocus = false;

        if (!this.open) { // do not emit blur if still open
            this.$emit('blur', event);
            this.showErrorMessage(this.inputModel);
        }


    }

    // override from Input-management
    private get isFocus(): boolean {
        return this.as<InputManagement>().internalIsFocus || this.open;
    }


    private convertValueToModel(input: DatePickerSupportedTypes): string {
        if (input) {
            try {
                return new ModulDate(input).toString();
            } catch (err) {
                return '';
            }
        }
        return '';
    }

    togglePopup(event: Event): void {
        this.open = !this.open;
        // stop event propagation to parent.
        event.stopPropagation();
    }

    private validateDateFormat(dateString: string): boolean {
        if (dateString) {
            if (!isNaN(Date.parse(dateString))) {
                return true;
            }
        }
        return false;
    }

    private convertStringToModel(newValue: string): DatePickerSupportedTypes {
        if (newValue && this.value instanceof Date) {
            return new Date(newValue);
        } else {
            return newValue;
        }
    }

    private convertModelToString(value: DatePickerSupportedTypes): string {
        if (value instanceof Date) {
            return new ModulDate(value.toISOString()).toString();
        } else {
            return value as string;
        }
    }

    private onKeydown(event: KeyboardEvent): void {


        if (this.as<InputStateMixin>().active) {
            if (event.key === 'Tab') {
                // close popop if open and tab key is pressed (accessibility)
                if (this.open) {
                    this.open = false;
                }
            }

            this.$emit('keydown', event);
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
