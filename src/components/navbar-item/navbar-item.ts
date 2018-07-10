import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { NAVBAR_ITEM_NAME } from '../component-names';
import WithRender from './navbar-item.html?style=./navbar-item.scss';

export abstract class BaseNavbar extends ModulVue { }

export interface Navbar {
    model: string;
    mouseEvent: boolean;
    updateValue(value: string): void;
    onMouseover(value: string, event): void;
    onMouseleave(value: string, event): void;
    onClick(value: string, event): void;
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

        // fix temporaire, créer une boucle infini si le skin ajoute du padding aux items
        if (this.$parent.$props.skin === 'darker' || this.$parent.$props.skin === 'darkest') {
            setTimeout(() => {
                this.setDimension();
            }, 0);
        }

    }

    private setDimension(): void {
        let w: number = this.$el.clientWidth;
        let lineHeight: number = parseFloat(window.getComputedStyle(this.$el).getPropertyValue('line-height'));
        let h: number = this.$el.clientHeight;
        let lines: number = h / lineHeight;

        if (lines > 2) {
            do {

                this.$el.style.maxWidth = 'none';
                w++;
                this.$el.style.width = w + 'px';

                h = this.$el.clientHeight;
                lines = h / lineHeight;

            } while (lines > 2);
            this.$emit('resize');
            this.$log.log('resize');
        }
    }

    private get isDisabled(): boolean {
        return this.disabled;
    }

    public get isSelected(): boolean {
        return !!this.parentNavbar && !this.disabled && this.value === this.parentNavbar.model;
    }

    private onClick(event: Event): void {
        if (!this.disabled && this.parentNavbar) {
            this.parentNavbar.onClick(this.value, event);
            if (this.value !== this.parentNavbar.model) {
                this.parentNavbar.updateValue(this.value);
            }
        }
    }

    private onMouseover(event: Event): void {
        if (!this.disabled && this.parentNavbar && this.parentNavbar.mouseEvent) {
            this.parentNavbar.onMouseover(this.value, event);
        }
    }

    private onMouseleave(event: Event): void {
        if (!this.disabled && this.parentNavbar && this.parentNavbar.mouseEvent) {
            this.parentNavbar.onMouseleave(this.value, event);
        }
    }
}

const NavbarItemPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(NAVBAR_ITEM_NAME + ' is not ready for production');
        v.component(NAVBAR_ITEM_NAME, MNavbarItem);
    }
};

export default NavbarItemPlugin;
