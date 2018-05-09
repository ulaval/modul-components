import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './dropdown-group.html?style=./dropdown-group.scss';
import { DROPDOWN_GROUP_NAME } from '../component-names';
import { BaseDropdownGroup, BaseDropdown, MDropdownInterface } from '../dropdown-item/dropdown-item';

@WithRender
@Component
export class MDropdownGroup extends BaseDropdownGroup {
    @Prop()
    public label: string;

    public root: BaseDropdown | undefined; // Dropdown component

    protected created(): void {
        this.root = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (this.root === undefined) {
            console.error('m-dropdown-group need to be inside m-dropdown');
        }
    }

    public get visible(): boolean {
        return ((this.root as any) as MDropdownInterface).groupHasItems(this);
    }
}

const DropdownGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(DROPDOWN_GROUP_NAME + ' is not ready for production');
        v.component(DROPDOWN_GROUP_NAME, MDropdownGroup);
    }
};

export default DropdownGroupPlugin;
