import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown-group.html?style=./dropdown-group.scss';
import { DROPDOWN_GROUP_NAME } from '../component-names';
import { BaseDropdownGroup, BaseDropdown, MDropdownInterface } from '../dropdown-item/dropdown-item';

// export interface MDropdownGroupInterface extends Vue {
//     nbItemsVisible: number;
// }

@WithRender
@Component
export class MDropdownGroup extends BaseDropdownGroup /*implements MDropdownGroupInterface*/ {
    @Prop()
    public label: string;

    public root: MDropdownInterface; // Dropdown component

    protected created(): void {
        let rootNode: BaseDropdown | undefined = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (rootNode) {
            this.root = (rootNode as any) as MDropdownInterface;
        } else {
            console.error('m-dropdown-group need to be inside m-dropdown');
        }
    }

    public get visible(): boolean {
        return this.root.groupHasItems(this);
    }
}

const DropdownGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_GROUP_NAME, MDropdownGroup);
    }
};

export default DropdownGroupPlugin;
