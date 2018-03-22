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

    // should be initialized to be reactive
    // tslint:disable-next-line:no-null-keyword
    private parentNavbar: Navbar | null = null;

    protected mounted(): void {

        let parentNavbar: BaseNavbar | undefined;
        parentNavbar = this.getParent<BaseNavbar>(
            p => p instanceof BaseNavbar || // these will fail with Jest, but should pass in prod mode
            p.$options.name === 'MNavbar' // these are necessary for Jest, but the first two should pass in prod mode
        );

        if (parentNavbar) {
            this.parentNavbar = (parentNavbar as any) as Navbar;

            if (!this.$el.querySelector('a, button')) {
                this.$el.setAttribute('tabindex', '0');
            }

        } else {
            console.error('m-navbar-item need to be inside m-navbar');
        }

    }

    private get isDisabled(): boolean {
        return this.disabled;
    }

    public get isSelected(): boolean {
        return !!this.parentNavbar && !this.disabled && this.value === this.parentNavbar.model;
    }

    private onClick(event): void {
        if (!this.disabled && this.parentNavbar) {
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
