import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './navbar-item.html?style=./navbar-item.scss';
import { NAVBAR_ITEM_NAME } from '../component-names';

export abstract class BaseNavbar extends ModulVue { }

export interface Navbar {
    model: string;
    updateValue(value: string): void;
}

@WithRender
@Component
export class MNavbarItem extends ModulVue {

    @Prop()
    public value: string;
    @Prop()
    public disabled: boolean;
    private hasParent: boolean = false;
    private parentNavbar: Navbar;

    protected mounted(): void {

        let parentNavbar: BaseNavbar | undefined = this.getParent<BaseNavbar>(p => p.$options.name === 'MNavbar');

        if (parentNavbar) {
            this.parentNavbar = (parentNavbar as any) as Navbar;
            this.hasParent = true;

            if (!this.$el.querySelector('a, button')) {
                this.$el.setAttribute('tabindex', '0');
            }

        } else {
            this.hasParent = false;
            console.error('m-navbar-item need to be inside m-navbar');
        }

    }

    private get isDisabled(): boolean {
        return this.disabled;
    }

    public get isSelected(): boolean {
        return this.hasParent && !this.disabled && this.value === this.parentNavbar.model;
    }

    private onClick(event): void {
        if (!this.disabled && this.hasParent) {
            this.parentNavbar.updateValue(this.value);
        }
    }
}

const NavbarItemPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(NAVBAR_ITEM_NAME + ' is not ready for production');
        v.component(NAVBAR_ITEM_NAME, MNavbarItem);
    }
};

export default NavbarItemPlugin;
