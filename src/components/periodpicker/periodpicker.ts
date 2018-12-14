import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { PERIODPICKER_NAME } from '../component-names';
import DatepickerPlugin, { DatePickerSupportedTypes } from '../datepicker/datepicker';
import WithRender from './periodpicker.html';

export class MDateRange {
    from: DatePickerSupportedTypes;
    to: DatePickerSupportedTypes;
}

@WithRender
@Component
export class MPeriodPicker extends ModulVue {
    @Prop()
    value: MDateRange;

    @Prop()
    min: DatePickerSupportedTypes;

    @Prop()
    max: DatePickerSupportedTypes;

    toIsFocused: boolean = false;

    get firstInputState(): any {
        return {
            props: { label: 'Du', value: this.internalValue.from, min: this.min, max: this.max },
            handlers: {
                change: (newValue: string) => this.onDateFromChange(newValue),
                open: () => this.onDateFromOpen()
            }
        };
    }

    get secondInputState(): any {
        return {
            props: { label: 'Au', focus: this.toIsFocused, value: this.internalValue.to, min: this.minDateTo, max: this.max },
            handlers: {
                change: (newValue: string) => this.onDateToChange(newValue),
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

    onDateFromChange(newValue: any): void {
        if (newValue) {
            const dateTo: DatePickerSupportedTypes = newValue > (this.internalValue.to || '') ? undefined : this.internalValue.to;

            this.$emit('input', Object.assign({}, this.internalValue, { from: newValue, to: dateTo }));
            this.toIsFocused = true;
        }
    }

    onDateToChange(newValue: any): void {
        if (newValue) {
            this.toIsFocused = false;
            this.$emit('input', Object.assign({}, this.internalValue, { to: newValue }));
        }
    }

    onDateFromOpen(): void {
        this.toIsFocused = false;
    }

    onDateToClose(): void {
        if (this.toIsFocused) {
            this.toIsFocused = false;
        }
    }
}

const PeriodpickerPlugin: PluginObject<any> = {
    install(v): void {
        v.use(DatepickerPlugin);
        v.component(PERIODPICKER_NAME, MPeriodPicker);
    }
};

export default PeriodpickerPlugin;
