import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { NAVBAR_NAME } from '../component-names';
import WithRender from './navbar.sandbox.html';

@WithRender
@Component
export class MNavbarSandbox extends Vue {

    public selectedItem = 'item4';
    public item1 = 'item1';
    public showMenu: boolean = false;

    update(value, event): void {
        if (value === 'item3') {
            this.showMenu = true;
        } else {
            this.showMenu = false;
        }
    }

    private get test(): string {
        return this.item1;
    }
}

const NavbarSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${NAVBAR_NAME}-sandbox`, MNavbarSandbox);
    }
};

export default NavbarSandboxPlugin;
