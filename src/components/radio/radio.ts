import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const POSITION_LEFT: string = 'left';

@WithRender
@Component
export class MRadio extends Vue {

    @Prop({ default: 'radio' })
    public name: string;
    @Prop({ default: 'radio' })
    public value: string;
    @Prop({ default: true })
    public label: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;

    public componentName: string = RADIO_NAME;
    private propLabel: boolean = true;
    private propPosition: string = POSITION_LEFT;
    private isFocus: boolean = false;
    private checkedValue: string = '';

    protected mounted(): void {
        this.propLabel = this.label;
        this.propPosition = this.position;
    }

    private onClick(event): void {
        this.$emit('click', this.checkedValue);
    }
}

const RadioPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
