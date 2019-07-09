import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { NAVBAR_NAME } from '../component-names';
import AccordionTransitionPlugin from '../transitions/accordion-transition/accordion-transition';
import NavbarPlugin from './navbar';
import WithRender from './navbar.sandbox.html';

@WithRender
@Component
export class MNavbarSandbox extends Vue {
    private selectedItem: string = 'item6';
    private selectedItemMainMenu: string = 'item2';
    private navOpenPres: boolean = false;
    private navOpenMod: boolean = true;
    private selectedItemPres: string = 'item1';
    private selectedItemMod: string = 'item1';
    private multiline: boolean = true;

    private toggleMultiline(): void {
        this.multiline = !this.multiline;
    }

    private toggleNavPres(): void {
        this.navOpenPres = !this.navOpenPres;
        this.navOpenMod = false;
    }

    private toggleNavMod(): void {
        this.navOpenMod = !this.navOpenMod;
        this.navOpenPres = false;
    }

    private closeNav(): void {
        this.navOpenPres = false;
        this.navOpenMod = false;
    }
}

const NavbarSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AccordionTransitionPlugin);
        v.use(ButtonPlugin);
        v.use(NavbarPlugin);
        v.component(`${NAVBAR_NAME}-sandbox`, MNavbarSandbox);
    }
};

export default NavbarSandboxPlugin;
