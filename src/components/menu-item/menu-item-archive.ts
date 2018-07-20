import { PluginObject } from 'vue';

import { MENU_ITEM_ARCHIVE_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import { MMenuItemPredefined } from './menu-item-predefined';

export class MMenuItemArchive extends MMenuItemPredefined {
    protected get iconName(): string {
        return 'm-svg__archive';
    }

    protected get label(): string {
        return this.$i18n.translate('m-menu:archive');
    }
}

const MenuItemArchivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_ARCHIVE_NAME, MMenuItemArchive);
    }
};

export default MenuItemArchivePlugin;
