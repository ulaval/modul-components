import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import { PERIODPICKER_NAME } from '../component-names';
import { DatePickerSupportedTypes } from '../datepicker/datepicker';
import WithRender from './periodpicker.html';

export class MDateRange {
    from: DatePickerSupportedTypes;
    to: DatePickerSupportedTypes;
}

interface MPeriodPickerFromProps {
    value: DatePickerSupportedTypes;
    min: DatePickerSupportedTypes;
    max: DatePickerSupportedTypes;
    disabled: boolean;
    waiting: boolean;
    error: boolean;
    valid: boolean;
    readonly: boolean;
}

interface MPeriodPickerFromHandlers {
    change(newValue: DatePickerSupportedTypes): void;
    open(): void;
}

export interface MPeriodPickerFromComponentVue extends MPeriodPickerFromProps, MPeriodPickerFromHandlers { }

interface MPeriodPickerToProps {
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

interface MPeriodPickerToHandlers {
    change(newValue: DatePickerSupportedTypes): void;
    close(): void;
}

export interface MPeriodPickerToComponentVue extends MPeriodPickerToProps, MPeriodPickerToHandlers { }

export type MPeriodPickerFromSlotProps = { props: MPeriodPickerFromProps, handlers: MPeriodPickerFromHandlers };

export type MPeriodPickerToSlotProps = { props: MPeriodPickerToProps, handlers: MPeriodPickerToHandlers };

export class MPeriodPickerProps {
    constructor(public value: MDateRange = { from: undefined, to: undefined },
        public min: DatePickerSupportedTypes = undefined,
        public max: DatePickerSupportedTypes = undefined) { }
}

@WithRender
@Component({
    mixins: [MediaQueries, InputState]
})
export class MPeriodPicker extends ModulVue implements MPeriodPickerProps {
    @Prop()
    value: MDateRange;

    @Prop()
    min: DatePickerSupportedTypes;

    @Prop()
    max: DatePickerSupportedTypes;

    toIsFocused: boolean = false;

    get firstInputState(): MPeriodPickerFromSlotProps {
        return {
            props: {
                value: this.internalValue.from,
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
                open: () => this.onDateFromOpen()
            }
        };
    }

    get secondInputState(): MPeriodPickerToSlotProps {
        return {
            props: {
                focus: this.toIsFocused,
                value: this.internalValue.to,
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
                close: () => this.onDateToClose()
            }
        };
    }

    get internalValue(): MDateRange {
        return this.value || {};
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
        if (newValue) {
            if (this.as<MediaQueriesMixin>().isMqMinS) {
                this.toIsFocused = true;
            }

            this.emitNewValue(Object.assign({}, this.internalValue, {
                from: newValue,
                to: newValue > (this.internalValue.to || '') ? undefined : this.internalValue.to
            }));
        } else {
            this.emitNewValue({ from: undefined, to: this.internalValue.to });
        }
    }

    onDateToChange(newValue: DatePickerSupportedTypes): void {
        if (newValue) {
            this.unfocusDateToField();
            this.emitNewValue(Object.assign({}, this.internalValue, { to: newValue }));
        } else {
            this.emitNewValue({ from: this.internalValue.from, to: undefined });
        }
    }

    @Emit('input')
    emitNewValue(newValue: MDateRange): MDateRange {
        return newValue;
    }

    onDateFromOpen(): void {
        this.unfocusDateToField();
    }

    onDateToClose(): void {
        this.unfocusDateToField();
    }

    unfocusDateToField(): void {
        this.toIsFocused = false;
    }
}

const PeriodpickerPlugin: PluginObject<any> = {
    install(v): void {
        v.component(PERIODPICKER_NAME, MPeriodPicker);
    }
};

export default PeriodpickerPlugin;
