import { CleaveOptions } from 'cleave.js/options';
import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { MInputMask } from './input-mask';
import WithRender from './input-mask.sandbox.html';




@WithRender
@WithRender
@Component({
    components: {
        MInputMask
    }
})
export class MInputMaskSandbox extends Vue {

    public integerModel: string = '';
    public decimalModel: string = '';
    public telephoneModel: string = '';
    public moneyModel: string = '';
    public dateModel: string = '';

    public integerOptions: CleaveOptions = {
        numeral: true,
        numeralThousandsGroupStyle: 'none',
        numeralIntegerScale: 3,
        numeralDecimalScale: 0,
        numeralPositiveOnly: true,
        stripLeadingZeroes: true
    };

    public decimalOptions: CleaveOptions = {
        numeral: true,
        numeralThousandsGroupStyle: 'none',
        numeralIntegerScale: 3,
        numeralDecimalScale: 2,
        numeralPositiveOnly: true,
        stripLeadingZeroes: true
    };

    public moneyOptions: CleaveOptions = {
        numeral: true,
        prefix: '$',
        rawValueTrimPrefix: true
    };

    public telephoneOptions: CleaveOptions = {
        numericOnly: true,
        delimiters: [' ', ' ', '-'],
        prefix: '+1',
        blocks: [2, 3, 3, 4]
    };

    public dateOptions: CleaveOptions = {
        date: true,
        datePattern: ['Y', 'm', 'd'],
        delimiter: '-'
    };
}



const InputMaskSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-input-mask-sandbox`, MInputMaskSandbox);
    }
};

export default InputMaskSandboxPlugin;
