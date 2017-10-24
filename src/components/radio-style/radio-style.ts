import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './radio-style.html?style=./radio-style.scss';
import { RADIO_STYLE_NAME } from '../component-names';

export enum MRadioStylePosition {
    Left = 'left',
    Right = 'right'
}

export interface RadioGroup {
    name: string;
    position: MRadioStylePosition;
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
        validator: value => value == MRadioStylePosition.Left || value == MRadioStylePosition.Right
    })
    public position: MRadioStylePosition;
    @Prop({ default: '1em' })
    public inputSize: string;
    @Prop({ default: false })
    public focus: boolean;
    @Prop({ default: false })
    public checked: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public fullWidth: boolean;

    private get isInputRight(): boolean {
        return this.position == MRadioStylePosition.Right;
    }

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }
}

const RadioStylePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_STYLE_NAME, MRadioStyle);
    }
};

export default RadioStylePlugin;
