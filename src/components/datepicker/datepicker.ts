
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupDirectivePlugin from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { InputMaxWidth, InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { Enums } from '../../utils/enums/enums';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import ModulDate from '../../utils/modul-date/modul-date';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import CalendarPlugin from '../calendar/calendar';
import { MBaseCalendarType, MBaseCalendarView } from '../calendar/calendar-renderer/base-calendar/base-calendar';
import { DATEPICKER_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import { InternalCleaveOptions, MInputMask } from '../input-mask/input-mask';
import InputStylePlugin from '../input-style/input-style';
import PopupPlugin from '../popup/popup';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import WithRender from './datepicker.html?style=./datepicker.scss';

export type DatePickerSupportedTypes = Date | string | undefined;

export enum MDatepickerDefaultView {
    Month = 'month',
    Day = 'day'
}

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

    @Prop({
        default: MBaseCalendarView.DAYS,
        validator: value => Enums.toValueArray(MBaseCalendarView).includes(value)
    })
    public initialView: MBaseCalendarView;

    @Prop({
        default: MBaseCalendarType.FULL_DATE,
        validator: value => Enums.toValueArray(MBaseCalendarType).includes(value)
    })
    public type: MBaseCalendarType;

    @Prop({ default: () => { return new ModulDate().subtract(10, 'year'); } })
    public min: DatePickerSupportedTypes;

    @Prop({ default: () => { return new ModulDate().add(10, 'year'); } })
    public max: DatePickerSupportedTypes;

    @Prop()
    public placeholder: string;

    @Prop({ default: InputMaxWidth.Small })
    public maxWidth: string;

    @Prop({ default: false })
    public hideInternalErrorMessage: boolean;

    @Prop({ default: false })
    public skipInputValidation: boolean;

    public id: string = `mDatepicker-${uuid.generate()}`;
    public $refs: {
        input: MInputMask;
    };

    private internalOpen: boolean = false;
    private internalCalendarErrorMessage: string = '';
    private inputModel = '';
    private internalDateModel = '';

    protected created(): void {
        if (this.value instanceof Date) {
            this.$log.warn('Using a Date as value for datepicker is not recommended and will be deprecated in 1.0, the value should use a string with the format "YYYY-MM-DD". Using a Date object can lead to timezone issue in your projet see -> https://stackoverflow.com/questions/29174810/javascript-date-timezone-issue');
        }
    }

    public get inputOptions(): InternalCleaveOptions {
        if (this.isTypeYearsMonths) {
            return {
                numericOnly: true,
                delimiters: ['-'],
                blocks: [4, 2]
            };
        }

        return {
            numericOnly: true,
            delimiters: ['-', '-'],
            blocks: [4, 2, 2]
        };
    }

    public get isTypeYearsMonths(): boolean {
        return this.type === MBaseCalendarType.YEARS_MONTHS;
    }

    public get propPlaceholder(): string {
        if (this.placeholder) {
            return this.placeholder;
        }
        return this.isTypeYearsMonths ? this.$i18n.translate('m-datepicker:placeholder-aaaa-mm') : this.$i18n.translate('m-datepicker:placeholder-aaaa-mm-jj');
    }

    public get formattedDate(): string {
        return this.convertValueToModel(this.model);
    }

    public get hasCalandarError(): boolean {
        return this.internalCalendarErrorMessage !== '' || this.as<InputState>().hasError;
    }

    public get calandarErrorMessage(): string {
        if (this.internalCalendarErrorMessage && !this.hideInternalErrorMessage) {
            return this.internalCalendarErrorMessage;
        } else {
            return this.as<InputState>().errorMessage !== undefined ? this.as<InputState>().errorMessage : '';
        }

    }

    public get open(): boolean {
        return this.internalOpen;
    }

    public set open(open: boolean) {
        if (this.as<InputState>().active) {
            this.internalOpen = open;
        }
    }

    public get minDateString(): string {
        return this.convertValueToModel(this.min);
    }

    public get maxDateString(): string {
        return this.convertValueToModel(this.max);
    }

    private get minModulDate(): ModulDate {
        return new ModulDate(this.min);
    }

    private get maxModulDate(): ModulDate {
        return new ModulDate(this.max);
    }

    private get maxInputLenght(): number {
        return this.isTypeYearsMonths ? 7 : 10;
    }

    @Emit('open')
    public async onOpen(): Promise<void> {
        let inputMask: MInputMask = this.$refs.input;
        inputMask.focusAndSelectAll();
    }

    @Emit('close')
    public async onClose(): Promise<void> {
        // emit blur if not focus and still open
        if (!this.as<InputManagement>().internalIsFocus) {
            this.emitBlur();
        }
    }

    @Emit('blur')
    private emitBlur(): void {
        if (!this.skipInputValidation) {
            this.showErrorMessage(this.inputModel);
        }
    }

    @Emit('click')
    private emitClick(event: Event): void { }

    @Emit('keydown')
    private emitKeydown(event: Event): void { }

    @Watch('skipInputValidation')
    private onSkipInputValidationChangement(skipInputValidation): void {
        this.inputDate(this.inputModel);
        this.showErrorMessage(this.inputModel);
    }

    public async selectDate(selectedDate: DatePickerSupportedTypes): Promise<void> {
        this.internalCalendarErrorMessage = '';
        this.model = this.convertValueToModel(selectedDate);
        this.inputModel = this.internalDateModel;
        this.open = false;
    }

    public inputDate(inputValue: string): void {
        this.inputModel = inputValue;

        if (!inputValue || inputValue === '') {
            this.model = '';
            this.clearErrorMessage();
        } else {

            if (this.open) {
                this.open = false;
            }

            if (this.skipInputValidation) {
                this.model = inputValue;
            } else {
                if (inputValue.length === this.maxInputLenght && this.showErrorMessage(inputValue)) {
                    this.model = this.inputModel;
                } else {
                    this.model = '';
                }
            }
        }
    }

    // Model management

    // override from InputManagement
    @Watch('value', { immediate: true })
    private onValueChange(value: DatePickerSupportedTypes): void {
        if (this.internalDateModel !== this.convertModelToString(value)) {
            this.internalDateModel = this.convertModelToString(value);

            this.inputModel = this.internalDateModel ? this.internalDateModel : '';
            this.showErrorMessage(this.inputModel);
        }
    }

    // override from InputManagement
    public set model(value: string) {
        if (this.internalDateModel !== value) {
            this.internalDateModel = value;
            this.emitChange();
        }
    }

    public get model(): string {
        return this.internalDateModel;
    }

    // override from InputManagement
    public get hasValue(): boolean {
        return !!(this.inputModel || '').toString().trim();
    }

    public togglePopup(event: Event): void {
        this.open = !this.open;
        // stop event propagation to parent.
        event.stopPropagation();
    }

    public emitChange(): void {
        this.$emit('change', this.convertStringToModel(this.internalDateModel));
    }

    public onKeydown(event: KeyboardEvent): void {
        if (this.as<InputStateMixin>().active) {
            if (event.key === 'Tab') {
                // close popop if open and tab key is pressed (accessibility)
                if (this.open) {
                    this.open = false;
                }
            }
            this.emitKeydown(event);
        }
    }

    public get hasErrorMessage(): boolean {
        return (!!this.as<InputState>().errorMessage || this.as<InputState>().errorMessage === ' '
            || !!(this.internalCalendarErrorMessage || '').trim()) &&
            !this.as<InputState>().disabled && !this.as<InputState>().waiting;
    }

    // Focus management.

    // override from InputManagement
    public onFocus(event: FocusEvent): void {
        if (!this.open) { // open on focus
            this.open = true;
        }

        this.as<InputManagement>().internalIsFocus = this.as<InputStateMixin>().active;
        if (this.as<InputManagement>().internalIsFocus) {
            this.$emit('focus', event);
        }
    }

    // override from InputManagement
    public onClick(event: MouseEvent): void {
        this.as<InputManagement>().internalIsFocus = this.as<InputStateMixin>().active;
        let inputEl: HTMLElement | undefined = this.as<InputStateMixin>().getInput();
        if (this.as<InputManagement>().internalIsFocus && inputEl) {
            inputEl.focus();
        }
        this.emitClick(event);
    }

    // override from InputManagement
    public onBlur(event: Event): void {
        this.as<InputManagement>().internalIsFocus = false;

        if (!this.open) { // do not emit blur if still open
            this.emitBlur();
        }
    }

    // override from Input-management
    public get isFocus(): boolean {
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

    private validateDateFormat(dateString: string): boolean {
        return Boolean(dateString) && !isNaN(Date.parse(dateString));
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
            if (value) {
                return value;
            } else {
                return '';
            }
        }
    }

    private clearErrorMessage(): void {
        this.internalCalendarErrorMessage = '';
    }

    private showErrorMessage(inputValue: string): boolean {
        if (inputValue === '' || inputValue === undefined || inputValue === null || this.skipInputValidation) {
            this.internalCalendarErrorMessage = '';
            return true;
        } else if (inputValue.length === this.maxInputLenght && this.validateDateFormat(inputValue)) {
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
