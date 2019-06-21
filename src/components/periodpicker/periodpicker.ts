import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import ModulDate from '../../utils/modul-date/modul-date';
import { ModulVue } from '../../utils/vue/vue';
import { PERIODPICKER_NAME } from '../component-names';
import { DatePickerSupportedTypes } from '../datepicker/datepicker';
import ValidationMessagePlugin from '../validation-message/validation-message';
import WithRender from './periodpicker.html?style=./periodpicker.scss';

export class MDateRange {
    constructor(public from?: DatePickerSupportedTypes, public to?: DatePickerSupportedTypes, public hasValidFormat?: boolean) { }

    get fromIsoString(): string | undefined {
        if (!this.from) {
            return undefined;
        }

        if (typeof this.from === 'string') {
            return this.from.includes('T') ? this.from : new ModulDate(this.from).toISOString();
        } else {
            return this.from.toISOString();
        }
    }

    get toIsoString(): string | undefined {
        if (!this.from) {
            return undefined;
        }

        if (typeof this.from === 'string') {
            return this.from.includes('T') ? this.from : new ModulDate(this.from).endOfDay().toISOString();
        } else {
            return this.from.toISOString();
        }
    }
}

interface MPeriodpickerFromProps {
    focus: boolean;
    value: DatePickerSupportedTypes;
    min: DatePickerSupportedTypes;
    max: DatePickerSupportedTypes;
    disabled: boolean;
    waiting: boolean;
    error: boolean;
    valid: boolean;
    readonly: boolean;
}

interface MPeriodpickerFromHandlers {
    change(newValue: DatePickerSupportedTypes): void;
    blur(): void;
}

export interface MPeriodpickerFromComponentVue extends MPeriodpickerFromProps, MPeriodpickerFromHandlers { }

interface MPeriodpickerToProps {
    focus: boolean;
    value: DatePickerSupportedTypes;
    min: DatePickerSupportedTypes;
    max: DatePickerSupportedTypes;
    disabled: boolean;
    waiting: boolean;
    error: boolean;
    valid: boolean;
    readonly: boolean;
}

interface MPeriodpickerToHandlers {
    change(newValue: DatePickerSupportedTypes): void;
    blur(): void;
}

export interface MPeriodpickerToComponentVue extends MPeriodpickerToProps, MPeriodpickerToHandlers { }

export interface MPeriodpickerFromSlotProps { props: MPeriodpickerFromProps; handlers: MPeriodpickerFromHandlers; }

export interface MPeriodpickerToSlotProps { props: MPeriodpickerToProps; handlers: MPeriodpickerToHandlers; }

export interface MPeriodpickerProps {
    value: MDateRange;
    min: DatePickerSupportedTypes;
    max: DatePickerSupportedTypes;
}

@WithRender
@Component({
    mixins: [
        MediaQueries,
        InputState,
        InputWidth
    ]
})
export class MPeriodpicker extends ModulVue implements MPeriodpickerProps {
    @Prop()
    value: MDateRange;

    @Prop()
    min: DatePickerSupportedTypes;

    @Prop()
    max: DatePickerSupportedTypes;

    @Prop({
        default: true
    })
    convertToIso: boolean;

    @Emit('input')
    emitNewValue(newValue: MDateRange): void { }

    dateFromInternalValue: DatePickerSupportedTypes = '';
    dateToInternalValue: DatePickerSupportedTypes = '';
    fromIsFocused: boolean = false;
    toIsFocused: boolean = false;
    beginSelection: boolean = false;

    get firstInputState(): MPeriodpickerFromSlotProps {
        return {
            props: {
                focus: this.fromIsFocused,
                value: this.dateFromInternalValue,
                min: this.min,
                max: this.max,
                disabled: this.as<InputState>().isDisabled,
                waiting: this.as<InputState>().isWaiting,
                error: this.as<InputState>().hasError,
                valid: this.as<InputState>().isValid,
                readonly: this.as<InputState>().readonly
            },
            handlers: {
                change: (newValue: DatePickerSupportedTypes) => this.onDateFromChange(newValue),
                blur: () => {
                    this.fromIsFocused = false;
                    if (!this.toIsFocused) {
                        this.endSelection();
                    }
                }
            }
        };
    }

    get secondInputState(): MPeriodpickerToSlotProps {
        return {
            props: {
                focus: this.toIsFocused,
                value: this.dateToInternalValue,
                min: this.minDateTo,
                max: this.max,
                disabled: this.as<InputState>().isDisabled,
                waiting: this.as<InputState>().isWaiting,
                error: this.as<InputState>().hasError,
                valid: this.as<InputState>().isValid,
                readonly: this.as<InputState>().readonly
            },
            handlers: {
                change: (newValue: DatePickerSupportedTypes) => this.onDateToChange(newValue),
                blur: () => {
                    this.toIsFocused = false;
                    if (this.beginSelection) {
                        this.beginSelection = false;
                        this.endSelection();
                    }
                }
            }
        };
    }

    get internalValue(): MDateRange {
        return new MDateRange(this.dateFromInternalValue, this.dateToInternalValue, MPeriodpicker.validateDateFormat(this.dateFromInternalValue)
            && MPeriodpicker.validateDateFormat(this.dateToInternalValue));
    }

    @Watch('value', { immediate: true })
    private onValueChange(value: MDateRange): void {
        this.dateFromInternalValue = MPeriodpicker.formatIsoDateToLocalString((this.value || { from: undefined }).from);
        this.dateToInternalValue = MPeriodpicker.formatIsoDateToLocalString((this.value || { to: undefined }).to);
    }

    get minDateTo(): DatePickerSupportedTypes {
        return this.internalValue.from ? this.internalValue.from : this.min;
    }

    get hasTextfieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    get isTextfieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    onDateFromChange(newValue: DatePickerSupportedTypes): void {
        this.beginSelection = true;
        this.dateFromInternalValue = newValue;
        if (newValue) {
            const newDateValue: DatePickerSupportedTypes = this.getNewModelValue(newValue);
            if (newValue && newDateValue) {
                this.toIsFocused = true;
            }
        }
    }

    onDateToChange(newValue: DatePickerSupportedTypes): void {
        this.beginSelection = true;
        this.dateToInternalValue = newValue;
        if (newValue) {
            const newDateValue: DatePickerSupportedTypes = this.getNewModelValue(newValue, true);
            if (newValue && newDateValue) {
                this.endSelection();
            }
        }
    }

    getNewModelValue(newValue: DatePickerSupportedTypes, endOfDay: boolean = false): DatePickerSupportedTypes {
        if (!newValue
            || (newValue.toString().length !== 10 && !(newValue instanceof Date) && !isFinite(newValue as any))
            || !MPeriodpicker.validateDateFormat(newValue.toString())) { return; }

        const modulDate: ModulDate = new ModulDate(newValue);
        const isoString: string = endOfDay ? modulDate.endOfDay().toISOString() : modulDate.beginOfDay().toISOString();

        return new Date(isoString);
    }

    endSelection(): void {
        const newDateFrom: DatePickerSupportedTypes = this.convertToIso ? this.internalDateFromIsoString : this.dateFromInternalValue;
        const newDateTo: DatePickerSupportedTypes = this.convertToIso ? this.internalDateToIsoString : this.dateToInternalValue;

        const isDateFromValid: boolean = MPeriodpicker.validateDateFormat(this.dateFromInternalValue);
        const isDateToValid: boolean = MPeriodpicker.validateDateFormat(this.dateToInternalValue);
        this.emitNewValue(new MDateRange(
            isDateFromValid ? newDateFrom : this.dateFromInternalValue,
            isDateToValid ? newDateTo : this.dateToInternalValue,
            isDateFromValid && isDateToValid
        ));
        this.beginSelection = false;
    }

    get internalDateFromIsoString(): DatePickerSupportedTypes {
        return this.getNewModelValue(this.dateFromInternalValue);
    }

    get internalDateToIsoString(): DatePickerSupportedTypes {
        return this.getNewModelValue(this.dateToInternalValue, true);
    }

    static validateDateFormat(dateString: DatePickerSupportedTypes): boolean {
        try {
            return new ModulDate(dateString) ? true : false;
        } catch {
            return false;
        }
    }

    /**
     * This method convert a date or a iso string into a local date string with format YYYY-MM-DD
     *
     * @param date
     */
    static formatIsoDateToLocalString(date: DatePickerSupportedTypes): DatePickerSupportedTypes {
        if (!date) {
            return '';
        }

        if (!this.validateDateFormat(date)) {
            return date;
        }

        let _date: Date | undefined = undefined;
        if (typeof date === 'string') {
            _date = new Date(date.includes('T') ? date : new Date(`${date}T00:00`));
        } else if (date instanceof Date) {
            _date = date;
        }

        if (!_date) { return; }

        let month: string = '' + (_date.getMonth() + 1);
        let day: string = '' + _date.getDate();
        let year: number = _date.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }
}

const PeriodpickerPlugin: PluginObject<any> = {
    install(v): void {
        v.use(ValidationMessagePlugin);
        v.component(PERIODPICKER_NAME, MPeriodpicker);
    }
};

export default PeriodpickerPlugin;
