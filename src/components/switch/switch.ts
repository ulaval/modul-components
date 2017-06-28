import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './switch.html?style=./switch.scss';
import { SWITCH_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const POSITION_LEFT: string = 'left';
const ON_TEXT: string = 'yes';
const OFF_TEXT: string = 'no';

@WithRender
@Component
export class MSwitch extends Vue {

    @Prop({ default: false })
    public isChecked: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;
    @Prop({ default: false })
    public hasLabel: boolean;
    @Prop({ default: ON_TEXT })
    public onText: string;
    @Prop({ default: OFF_TEXT })
    public offText: string;

    public componentName: string = SWITCH_NAME;
    private propsIsChecked: boolean = true;
    private propsHasLabel: boolean = true;
    private propsOnText: string = ON_TEXT;
    private propsOffText: string = OFF_TEXT;
    private isFocus = false;
    private id: string = `switch${uuid.generate()}`;

    public mounted(): void {
        this.propsIsChecked = this.isChecked;
        this.propsHasLabel = this.hasLabel;
        this.propsOnText = this.onText;
        this.propsOffText = this.offText;
    }

    private onClick(event): void {
        this.$emit('click');
        this.$refs['switch']['blur']();
    }

    public get hasSwitchLeft(): boolean {
        return this.position == POSITION_LEFT;
    }
}

const SwitchPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SWITCH_NAME, MSwitch);
    }
};

export default SwitchPlugin;
