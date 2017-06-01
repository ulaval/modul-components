import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME } from '../component-names';

@WithRender
@Component
export class MButton extends Vue {
    public highlight(): void {
        this.$el.style.backgroundColor = 'yellow';
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
