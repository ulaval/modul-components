import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './popper-list.html?style=./popper-list.scss';
import { POPPER_LIST_NAME } from '../component-names';

@WithRender
@Component
export class MPopperList extends Vue {

}

const PopperListPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(POPPER_LIST_NAME, MPopperList);
    }
};

export default PopperListPlugin;
