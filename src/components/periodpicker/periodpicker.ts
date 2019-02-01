import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import { PERIODPICKER_NAME } from '../component-names';
import DatepickerPlugin, { DatePickerSupportedTypes } from '../datepicker/datepicker';
import WithRender from './periodpicker.html';

export class MDateRange {
    from: DatePickerSupportedTypes;
    to: DatePickerSupportedTypes;
}

interface MPeriodPickerFromProps {
    value: DatePickerSupportedTypes;
    min: DatePickerSupportedTypes;
    max: DatePickerSupportedTypes;
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
}

interface MPeriodPickerToHandlers {
    change(newValue: DatePickerSupportedTypes): void;
    close(): void;
}

export interface MPeriodPickerToComponentVue extends MPeriodPickerToProps, MPeriodPickerToHandlers { }

export type MPeriodPickerFromSlotProps = { props: MPeriodPickerFromProps, handlers: MPeriodPickerFromHandlers };

export type MPeriodPickerToSlotProps = { props: MPeriodPickerToProps, handlers: MPeriodPickerToHandlers };

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MPeriodPicker extends ModulVue {
    @Prop()
    value: MDateRange;

    @Prop()
    min: DatePickerSupportedTypes;

    @Prop()
    max: DatePickerSupportedTypes;

    toIsFocused: boolean = false;

    get firstInputState(): MPeriodPickerFromSlotProps {
        return {
            props: { value: this.internalValue.from, min: this.min, max: this.max },
            handlers: {
                change: (newValue: DatePickerSupportedTypes) => this.onDateFromChange(newValue),
                open: () => this.onDateFromOpen()
            }
        };
    }

    get secondInputState(): MPeriodPickerToSlotProps {
        return {
            props: { focus: this.toIsFocused, value: this.internalValue.to, min: this.minDateTo, max: this.max },
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
        v.use(DatepickerPlugin);
        v.component(PERIODPICKER_NAME, MPeriodPicker);
    }
};

export default PeriodpickerPlugin;
