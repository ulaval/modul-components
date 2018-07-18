import { PluginObject } from 'vue';

import { MENU_ITEM_EDIT_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import { MMenuItemPredefined } from './menu-item-predefined';

export class MMenuItemEdit extends MMenuItemPredefined {
    protected get iconName(): string {
        return 'm-svg__edit';
    }

    protected get label(): string {
        return this.$i18n.translate('m-menu:edit');
    }
}

const MenuItemEditPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_EDIT_NAME, MMenuItemEdit);
    }
};

export default MenuItemEditPlugin;
