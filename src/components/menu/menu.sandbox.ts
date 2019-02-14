import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { MENU_NAME } from '../component-names';
import MenuPlugin from './menu';
import WithRender from './menu.sandbox.html';


@WithRender
@Component
export class MMenuSandbox extends Vue {

    private selectedItem: string = 'item2';
    private selectedItemLight: string = 'subitem1';
    private openDarkSkin: boolean = false;
    private openLightSkin: boolean = false;
    private openItemGroup1DarkSkin: boolean = false;
    private openItemGroup1LightSkin: boolean = false;

    private changeModel(): void {
        this.selectedItem = this.selectedItem === 'item2' ? 'subitem1' : 'item2';
        this.selectedItemLight = this.selectedItemLight === 'subitem1' ? 'item2' : 'subitem1';
    }

    private toggleDarkSkin(): void {
        this.openDarkSkin = !this.openDarkSkin;
    }

    private toggleLightSkin(): void {
        this.openLightSkin = !this.openLightSkin;
    }

    private toggleItemGroup1DarkSkin(): void {
        this.openItemGroup1DarkSkin = !this.openItemGroup1DarkSkin;
    }

    private toggleItemGroup1LightSkin(): void {
        this.openItemGroup1LightSkin = !this.openItemGroup1LightSkin;
    }
}

const MenuSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(MenuPlugin);
        v.component(`${MENU_NAME}-sandbox`, MMenuSandbox);
    }
};

export default MenuSandboxPlugin;
