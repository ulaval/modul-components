import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { NAVBAR_ITEM_NAME } from '../component-names';
import WithRender from './navbar-item.sandbox.html';

@WithRender
@Component
export class MNavbarItemSandbox extends Vue {
}

const NavbarItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${NAVBAR_ITEM_NAME}-sandbox`, MNavbarItemSandbox);
    }
};

export default NavbarItemSandboxPlugin;
