import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

export enum MRadioPosition {
    LEFT = 'left',
    RIGHT = 'right'
}

@WithRender
@Component
export class MRadio extends Vue {

    @Prop({ default: true })
    public label: boolean;
    @Prop({ default: 'value1' })
    public value: string;
    @Prop({})
    public radioLabel: string;
    @Prop({ default: MRadioPosition.LEFT })
    public position: string;

    public componentName: string = RADIO_NAME;
    public name: string;
    public radioID: string;
    public checked: boolean = false;

    private propLabel: boolean = true;
    private propPosition: string = MRadioPosition.LEFT;
    private isFocus: boolean = false;
    private checkedValue: string = '';

    protected mounted(): void {
        this.propLabel = this.label;
        this.propPosition = this.position;
    }

    private onClick(event): void {
        this.$emit('click', this.checkedValue);
        this.$emit('input', this.value);
    }
}

const RadioPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
