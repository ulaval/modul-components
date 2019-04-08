import Cleave from 'cleave.js';
import { CleaveOptions } from 'cleave.js/options';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './input-mask.html';

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
    inputValue: string;

    @Prop({ default: true })
    public raw: boolean;

    // https://github.com/nosir/cleave.js/blob/master/doc/options.md
    @Prop()
    public options: CleaveOptions;

    private cleave: Cleave;

    mounted(): void {
        this.cleave = new Cleave(this.$refs.input, this.getOptions());
        this.cleave.setRawValue(this.inputValue);
    }

    beforeDestroy(): void {
        this.cleave.destroy();
    }

    private getOptions(): CleaveOptions {
        return {
            ...this.options,
            onValueChanged: (event => {
                let _value: string = this.raw ? event.target.rawValue : event.target.value;
                this.$emit('input', _value);
            })
        };
    }

    @Watch('options', { deep: true })
    public optionsChanged(options: CleaveOptions): void {
        this.cleave.destroy();
        this.cleave = new Cleave(this.$el as HTMLElement, this.getOptions());
        this.cleave.setRawValue(this.inputValue);
    }

    @Watch('inputValue')
    public inputValueChanged(inputValue: string): void {
        // when v-model is not masked (raw)
        if (this.raw && inputValue === this.cleave.getRawValue()) {
            return;
        }
        //  when v-model is masked (NOT raw)
        if (!this.raw && inputValue === this.$refs.input.value) {
            return;
        }

        this.cleave.setRawValue(inputValue);
    }


    onFocus($event: any): void {
        this.$emit('focus', $event);
    }

    onBlur($event: any): void {
        this.$emit('blur', $event);
    }

    onKeyup($event: any): void {
        this.$emit('keyup', $event);
    }

    onKeydownTextfield($event: any): void {
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
}
