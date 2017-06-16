import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME } from '../component-names';
import { ICON_NAME } from '../component-names';

@WithRender
@Component
export class MButton extends Vue {

    @Prop({ default: 'button' })
    public type: string;
    @Prop({ default: 'primary' })
    public mode: string;
    @Prop({ default: 'default' })
    public state: string;
    @Prop()
    public iconName: string;
    @Prop({ default: 'left' })
    public iconPosition: string;

    public componentName: string = BUTTON_NAME;

    private propsType: string = 'button';
    private propsMode: string = 'primary';
    private propsState: string = 'default';

    private errorMessageIcon: string = 'ERROR in <' + BUTTON_NAME + ' mode="icon"> : props "iconName" is undefined';

    private onClick(event): void {
        this.$emit('onClick');
        this.$el.blur();
    }

    private mounted(): void {
        this.propsType = this.$props.type == undefined ? 'button' : this.$props.type;
        this.propsMode = this.$props.mode == undefined ? 'primary' : this.$props.mode;
        this.propsState = this.$props.state == undefined ? 'default' : this.$props.state;
    }

    private get hasIcone(): boolean {
        return !!this.$props.iconName;
    }

    private get hasIconeLeft(): boolean {
        return this.$props.iconPosition == 'left' ? true : false;
    }

    private get hasMoreInfo(): boolean {
        return !!this.$slots['more-info'];
    }

    private get hasSlots(): boolean {
        return !!this.$slots.default;
    }

    private get isDisabled(): boolean {
        if (this.propsState == 'waiting' || this.propsState == 'disabled' || this.propsState == 'selected') {
            return true;
        }
        return false;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
