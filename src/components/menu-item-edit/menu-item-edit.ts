import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_EDIT_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import WithRender from './menu-item-edit.html';

@WithRender
@Component
export class MMenuItemEdit extends ModulVue {
    @Prop()
    public disabled: boolean;

    private onClick(event: Event): void {
        this.$emit('click', event);
    }
}

const MenuItemEditPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_EDIT_NAME, MMenuItemEdit);
    }
};

export default MenuItemEditPlugin;
