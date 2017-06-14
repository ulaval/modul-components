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
    public aspect: string;
    @Prop({ default: 'default' })
    public state: string;

    private componentName: string = BUTTON_NAME;

    private propsType: string = 'button';
    private propsAspect: string = 'primary';
    private propsState: string = 'default';

    private onClick(event): void {
        this.$emit('onClick');
        this.$el.blur();
    }

    private mounted(): void {
        this.propsType = this.$props.type == undefined ? 'button' : this.$props.type;
        this.propsAspect = this.$props.aspect == undefined ? 'primary' : this.$props.aspect;
        this.propsState = this.$props.state == undefined ? 'default' : this.$props.state;
    }

    private checkAccordion(index: number): boolean {
        return this.$children[index]['componentName'] == ICON_NAME ? true : false;
    }

    private get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    private get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }

    private get hasMoreInfo(): boolean {
        return !!this.$slots['more-info'];
    }

    private get hasHiddenText(): boolean {
        return !!this.$slots['icon-hidden-text'];
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
