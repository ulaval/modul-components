import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
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
    private internalPropChecked: boolean = false;
    private isFocus = false;
    private id: string = `switch${uuid.generate()}`;

    protected mounted(): void {
        this.propChecked = this.checked;
    }

    protected get propChecked(): boolean {
        return this.internalPropChecked;
    }

    protected set propChecked(value: boolean) {
        if (this.internalPropChecked != value) {
            this.internalPropChecked = value;
            this.$emit('update:checked', value);
            this.$emit('checked', value);
        }
    }

    @Watch('checked')
    private checkedChanged(value: boolean): void {
        this.propChecked = this.checked;
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
