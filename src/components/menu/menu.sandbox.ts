import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { MENU_NAME } from '../component-names';
import WithRender from './menu.sandbox.html';

@WithRender
@Component
export class MMenuSandbox extends Vue {

    public selectedItem = 'item2';
    public item1 = 'item1';

    public click(): void {
        this.selectedItem = 'item3';
    }

}

const MenuSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${MENU_NAME}-sandbox`, MMenuSandbox);
    }
};

export default MenuSandboxPlugin;
