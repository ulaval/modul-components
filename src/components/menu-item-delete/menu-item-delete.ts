import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_DELETE_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import WithRender from './menu-item-delete.html';

@WithRender
@Component
export class MMenuItemDelete extends ModulVue {
}

const MenuItemDeletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_DELETE_NAME, MMenuItemDelete);
    }
};

export default MenuItemDeletePlugin;
