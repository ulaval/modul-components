import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { RADIO_STYLE_NAME } from '../component-names';
import WithRender from './radio-style.html?style=./radio-style.scss';

export enum MRadioStylePosition {
    Left = 'left',
    Right = 'right'
}

export interface RadioGroup {
    name: string;
    radioPosition: MRadioStylePosition;
    enabled: boolean;
    inline: boolean;
    getValue(): string;
    updateValue(value: string): void;
}

@WithRender
@Component
export class MRadioStyle extends ModulVue {

    @Prop({
        default: MRadioStylePosition.Right,
        validator: value =>
            value === MRadioStylePosition.Left ||
            value === MRadioStylePosition.Right
    })
    public radioPosition: MRadioStylePosition;
    @Prop({ default: '1em' })
    public inputSize: string;
    @Prop()
    public focus: boolean;
    @Prop()
    public checked: boolean;
    @Prop()
    public disabled: boolean;
    @Prop()
    public fullWidth: boolean;

    private get isInputRight(): boolean {
        return this.radioPosition === MRadioStylePosition.Right;
    }

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }
}

const RadioStylePlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(RADIO_STYLE_NAME, MRadioStyle);
    }
};

export default RadioStylePlugin;
