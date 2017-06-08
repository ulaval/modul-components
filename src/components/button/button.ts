import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME } from '../component-names';

@WithRender
@Component
export class MButton extends Vue {

    @Prop({ default: 'primary' })
    public type: string;
    @Prop({ default: 'default' })
    public state: string;

    private componentName: string = BUTTON_NAME;

    public get isDisabled(): boolean {
        if (this.$props.state == 'selected' || this.$props.state == 'waiting' || this.$props.state == 'disabled') {
            return true;
        }
        return false;
    }

    private onClick(event) {
        this.$emit('onClick');
    }

    public get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    public get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }

    public get hasMoreInfo(): boolean {
        return !!this.$slots['more-info'];
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
