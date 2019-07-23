import Cleave from 'cleave.js';
import { CleaveOptions } from 'cleave.js/options';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './input-mask.html';

export interface InternalCleaveOptions {
    numericOnly?: boolean;
    delimiters?: ReadonlyArray<string>;
    blocks?: ReadonlyArray<number>;
    numeral?: boolean;
    numeralDecimalScale?: number;
    numeralThousandsGroupStyle?: 'lakh' | 'thousand' | 'wan' | 'none';
    numeralIntegerScale?: number;
    numeralDecimalMark?: string;
    numeralPositiveOnly?: boolean;
    stripLeadingZeroes?: boolean;
    removeTrailingDecimalMark?: boolean;
    forceDecimalScale?: boolean;
    phone?: boolean;
    phoneRegionCode?: string;
    prefix?: string;
    time?: boolean;
    timePattern?: ReadonlyArray<string>;
    delimiter?: string;
}

export interface InputMaskOptions extends InternalCleaveOptions {
    removeTrailingDecimalMark?: boolean;
    forceDecimalScale?: boolean;
}

/**
 * inspired from https://github.com/ankurk91/vue-cleave-component/blob/master/src/component.js
 */
@WithRender
@Component
export class MInputMask extends ModulVue {
    public $refs: {
        input: HTMLInputElement;
    };

    @Prop()
    @Model('input')
    value: string;

    @Prop({ default: true })
    public raw: boolean;

    // https://github.com/nosir/cleave.js/blob/master/doc/options.md
    @Prop()
    public options: InputMaskOptions;

    private cleave: Cleave;


    private internalModel = '';

    mounted(): void {
        this.internalModel = this.value || '';
        this.cleave = new Cleave(this.$refs.input, this.getOptions());
        this.updateRawValue(this.value);
    }

    beforeDestroy(): void {
        this.cleave.destroy();
    }

    private getOptions(): CleaveOptions {
        return {
            ...this.options,
            onValueChanged: (event => {
                let _value: string = this.raw ? event.target.rawValue : event.target.value;

                // only emit if model is changed
                // when v-model is not masked (raw)
                if (this.internalModel === _value) {
                    return;
                } else {
                    this.internalModel = _value;
                    this.$emit('input', _value);
                }
            })
        };
    }

    public async focusAndSelectAll(): Promise<any> {
        await this.$nextTick();
        this.$refs.input.focus();
        this.$refs.input.setSelectionRange(0, this.$refs.input.value.length);
    }

    public async focus(): Promise<any> {
        await this.$nextTick();
        this.$refs.input.focus();
    }

    @Watch('options', { deep: true })
    public optionsChanged(options: any): void {
        this.cleave.destroy();
        this.cleave = new Cleave(this.$el as HTMLElement, this.getOptions());
        this.updateRawValue(this.value);
    }

    @Watch('value')
    public inputValueChanged(inputValue: string): void {
        // when v-model is not masked (raw)
        if (this.raw && inputValue === this.cleave.getRawValue()) {
            return;
        }
        //  when v-model is masked (NOT raw)
        if (!this.raw && inputValue === this.$refs.input.value) {
            return;
        }

        this.internalModel = this.value || '';
        this.updateRawValue(inputValue);
    }

    onFocus($event: any): void {
        this.$emit('focus', $event);
    }

    onBlur($event: any): void {
        this.updateRawValue();
        this.$emit('blur', $event);
    }

    onKeyup($event: KeyboardEvent): void {
        this.$emit('keyup', $event);
    }

    onKeydownTextfield($event: KeyboardEvent): void {
        const rawValue: string = this.cleave.getRawValue();
        if (($event.key === '.' || $event.key === ',') && !rawValue.endsWith('.')) {
            this.cleave.setRawValue(`${rawValue}.`);
        }

        this.$emit('keydown', $event);
    }

    // Hack pour android qui lève toujours le key code 229.
    onTextInput($event: KeyboardEvent): void {
        const key: string = ($event as any).data;
        const rawValue: string = this.cleave.getRawValue();
        if (key === '.' && !rawValue.endsWith('.')) {
            this.cleave.setRawValue(`${rawValue}.`);
        }

        this.$emit('keydown', $event);
    }

    onEnter($event: any): void {
        this.$emit('keydown.enter', $event);
    }

    onPasteTextfield($event: any): void {
        this.$emit('paste', $event);
    }

    onDropTextfield($event: any): void {
        this.$emit('drop', $event);
    }

    onChange($event: any): void {
        this.$emit('change', $event);
    }

    updateRawValue(rawValue: string = this.cleave.getRawValue()): void {
        // See what happens with issue https://github.com/nosir/cleave.js/issues/463.
        // Remove this code if it's resolved.
        if (this.options.removeTrailingDecimalMark && this.options.numeral === true && rawValue[rawValue.length - 1] === '.') {
            this.cleave.setRawValue(rawValue.replace('.', ''));
        } else if (this.options.forceDecimalScale && this.options.numeral && rawValue.includes('.') && this.options.numeralDecimalScale) {
            const valueStringParts: string[] = rawValue.split('.');
            const integerPart: string = valueStringParts[0];
            const decimalPart: string = valueStringParts[1];
            this.cleave.setRawValue(`${integerPart}.${decimalPart.padEnd(this.options.numeralDecimalScale, '0')}`);
        } else {
            this.cleave.setRawValue(rawValue);
        }
    }
}
