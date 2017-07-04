import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button-group.html?style=./button-group.scss';
import { BUTTON_GROUP_NAME } from '../component-names';

@WithRender
@Component
export class MButtonGroup extends Vue {

}

const ButtonGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_GROUP_NAME, MButtonGroup);
    }
};

export default ButtonGroupPlugin;
