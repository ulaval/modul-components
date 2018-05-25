import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { MENU_ITEM_NAME } from '../component-names';
import WithRender from './menu-item.sandbox.html';

@WithRender
@Component
export class MMenuItemSandbox extends Vue {
}

const MenuItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${MENU_ITEM_NAME}-sandbox`, MMenuItemSandbox);
    }
};

export default MenuItemSandboxPlugin;
