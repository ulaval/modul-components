import { PluginObject } from 'vue';

import { MENU_ITEM_ADD_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import { MMenuItemPredefined } from './menu-item-predefined';

export class MMenuItemAdd extends MMenuItemPredefined {
    protected get iconName(): string {
        return 'm-svg__add';
    }

    protected get label(): string {
        return this.$i18n.translate('m-menu:add');
    }
}

const MenuItemAddPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_ADD_NAME, MMenuItemAdd);
    }
};

export default MenuItemAddPlugin;
