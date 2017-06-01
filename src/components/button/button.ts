import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME } from '../component-names';

@WithRender
@Component({
    props: {
        type : {
            type: String,
            default: 'primary'
        },
        isWaiting: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    }
})
export class MButton extends Vue {
    private componentName: string = BUTTON_NAME;
    private rippleEffectIsActive: boolean = true;

    public mounted() {
        if (this.$props.isWaiting || this.$props.isDisabled) {
            this.rippleEffectIsActive = false;
        }
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
