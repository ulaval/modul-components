import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_ADD_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import WithRender from './menu-item-add.html';

@WithRender
@Component
export class MMenuItemAdd extends ModulVue {
}

const MenuItemAddPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_ADD_NAME, MMenuItemAdd);
    }
};

export default MenuItemAddPlugin;
