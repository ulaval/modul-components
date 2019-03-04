import Cleave from 'cleave.js';
import { CleaveOptions } from 'cleave.js/options';
import Component from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './input-mask.html';

@WithRender
@Component
export class MInputMask extends ModulVue {

    @Prop()
    @Model('input')
    inputValue: string;


    @Prop({ default: true })
    public raw: boolean;

    private cleave: Cleave;
    // private onValueChangedFn: any;

    mounted(): void {
        this.cleave = new Cleave(this.$el, this.getOptions());
    }

    beforeDestroy(): void {
        this.cleave.destroy();
    }

    private getOptions(): CleaveOptions {


        return {
            creditCard: true,
            onValueChanged: (event => {
                let _value: string = this.raw ? event.target.rawValue : event.target.value;
                // tslint:disable-next-line: no-console
                console.log('asdsadas=' + _value);
                this.$emit('input', _value);
            })
        };

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
