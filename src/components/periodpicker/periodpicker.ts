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
    from: DatePickerSupportedTypes;
    to: DatePickerSupportedTypes;
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
                value: MPeriodpicker.formatIsoDateToLocalString(this.internalValue.from),
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
                blur: () => { this.fromIsFocused = false; }
            }
        };
    }

    get secondInputState(): MPeriodpickerToSlotProps {
        return {
            props: {
                focus: this.toIsFocused,
                value: MPeriodpicker.formatIsoDateToLocalString(this.internalValue.to),
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
        return { from: this.dateFromInternalValue, to: this.dateToInternalValue };
    }

    @Watch('value', { immediate: true })
    private onValueChange(value: MDateRange): void {
        this.dateFromInternalValue = (value || {}).from || '';
        this.dateToInternalValue = (value || {}).to || '';
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
        this.dateFromInternalValue = newValue ? this.getNewModelValue(newValue) : undefined;


        if (newValue) {
            this.beginSelection = true;
            this.toIsFocused = true;
        } else {
            this.endSelection();
        }
    }

    onDateToChange(newValue: DatePickerSupportedTypes): void {
        this.beginSelection = false;
        this.dateToInternalValue = newValue ? this.getNewModelValue(newValue, true) : undefined;
        this.endSelection();
    }

    getNewModelValue(newValue: DatePickerSupportedTypes, endOfDay: boolean = false): DatePickerSupportedTypes {
        if (!newValue) { return; }

        const modulDate: ModulDate = new ModulDate(newValue);
        const isoString: string = endOfDay ? modulDate.endOfDay().toISOString() : modulDate.toISOString();

        return new Date(isoString);
    }

    endSelection(): void {
        this.emitNewValue({ from: this.dateFromInternalValue || undefined, to: this.dateToInternalValue || undefined });
    }


    /**
     * This method convert a date or a iso string into a local date string with format YYYY-MM-DD
     *
     * @param date
     */
    static formatIsoDateToLocalString(date?: DatePickerSupportedTypes): string {
        if (!date) {
            return '';
        }
        let _date: Date;
        if (date instanceof Date) {
            _date = date;
        } else {
            _date = new Date(date);
        }

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
