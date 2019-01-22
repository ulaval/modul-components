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

    get firstInputState(): any {
        return {
            // TODO : Put back label when the bug is gone
            props: { /* label: 'Du', */value: this.internalValue.from, min: this.min, max: this.max },
            handlers: {
                change: (newValue: string) => this.onDateFromChange(newValue),
                open: () => this.onDateFromOpen()
            }
        };
    }

    get secondInputState(): any {
        return {
            // TODO : Put back label when the bug is gone
            props: { /*label: 'Au', */focus: this.toIsFocused, value: this.internalValue.to, min: this.minDateTo, max: this.max },
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

    onDateToChange(newValue: any): void {
        if (newValue) {
            this.toIsFocused = false;
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
