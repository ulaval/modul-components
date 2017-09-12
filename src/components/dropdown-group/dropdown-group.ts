import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown-group.html?style=./dropdown-group.scss';
import { DROPDOWN_GROUP_NAME } from '../component-names';
import { BaseDropdownGroup } from '../dropdown-item/dropdown-item';

export interface MDropdownGroupInterface extends Vue {
    nbItemsVisible: number;
}

@WithRender
@Component
export class MDropdownGroup extends BaseDropdownGroup implements MDropdownGroupInterface {
    @Prop()
    public label: string;

    public componentName: string = DROPDOWN_GROUP_NAME;

    public nbItemsVisible: number = 0;

    public get visible(): boolean {
        return this.nbItemsVisible > 0;
    }
}

const DropdownGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_GROUP_NAME, MDropdownGroup);
    }
};

export default DropdownGroupPlugin;
