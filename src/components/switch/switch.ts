import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './switch.html?style=./switch.scss';
import { SWITCH_NAME } from '../component-names';

const POSITION_LEFT: string = 'left';

@WithRender
@Component
export class MSwitch extends Vue {

    @Prop({ default: 'switch' })
    public name: string;
    @Prop({ default: true })
    public hasLabel: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;

    public componentName: string = SWITCH_NAME;
    private propsHasLabel: boolean = true;
    private propsPosition: string = POSITION_LEFT;
    private isFocus: boolean = false;
    private checkedValue: string = '';
    private test: boolean = false;

    private mounted(): void {
        this.propsHasLabel = this.hasLabel;
        this.propsPosition = this.position;
    }

    private onClick(event): void {
        this.$emit('click', this.checkedValue);
    }
}

const SwitchPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SWITCH_NAME, MSwitch);
    }
};

export default SwitchPlugin;
