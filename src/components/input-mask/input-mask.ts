import Cleave from 'cleave.js';
import { CleaveOptions } from 'cleave.js/options';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_MASK_NAME } from '../component-names';
import WithRender from './input-mask.html';

@WithRender
@Component
export class MInputMask extends ModulVue {

    @Prop()
    public value: string;


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
                this.$emit('input', _value);
            })
        };

    }

    // private onBlur(event: Event): void {
    //     this.$emit('blur', this.value)
    // }

}


const InputMaskPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(INPUT_MASK_NAME, MInputMask);
    }
};

export default InputMaskPlugin;
