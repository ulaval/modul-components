import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './switch.html?style=./switch.scss';
import { SWITCH_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const POSITION_LEFT: string = 'left';

@WithRender
@Component
export class MSwitch extends Vue {

    @Prop({ default: false })
    public checked: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;
    @Prop({ default: false })
    public label: boolean;
    @Prop({ default: true })
    public helperText: boolean;

    public componentName: string = SWITCH_NAME;
    private propsChecked: boolean = true;
    private propsLabel: boolean = true;
    private propsHelperText: boolean = true;
    private isFocus = false;
    private id: string = `switch${uuid.generate()}`;

    protected mounted(): void {
        this.propsChecked = this.checked;
        this.propsLabel = this.label;
        this.propsHelperText = this.helperText;
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
