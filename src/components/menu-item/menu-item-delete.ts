import { PluginObject } from 'vue';

import { MENU_ITEM_DELETE_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import { MMenuItemPredefined } from './menu-item-predefined';

export class MMenuItemDelete extends MMenuItemPredefined {
    protected get iconName(): string {
        return 'm-svg__delete';
    }

    protected get label(): string {
        return this.$i18n.translate('m-menu:delete');
    }
}

const MenuItemDeletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_DELETE_NAME, MMenuItemDelete);
    }
};

export default MenuItemDeletePlugin;
