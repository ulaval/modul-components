import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_ARCHIVE_NAME } from '../component-names';
import MenuItemPlugin from '../icon/icon';
import WithRender from './menu-item-archive.html';

@WithRender
@Component
export class MMenuItemArchive extends ModulVue {
    private onClick(event: Event): void {
        this.$emit('click', event);
    }
}

const MenuItemArchivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MenuItemPlugin);
        v.component(MENU_ITEM_ARCHIVE_NAME, MMenuItemArchive);
    }
};

export default MenuItemArchivePlugin;
