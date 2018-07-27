import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { NAVBAR_ITEM_NAME } from '../component-names';
import { BaseNavbar, Navbar } from '../navbar/navbar';
import WithRender from './navbar-item.html?style=./navbar-item.scss';

// must be sync with selected css class
const SELECTEDCLASS: string = 'm--is-selected';

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

            this.setDimension();

        } else {
            console.error('m-navbar-item need to be inside m-navbar');
        }

    }

    private setDimension(): void {
        let lineHeight: number = parseFloat(window.getComputedStyle(this.$el).getPropertyValue('line-height'));
        // must subtract the padding, create a infinite loop
        let pt: number = parseInt(window.getComputedStyle(this.$el).getPropertyValue('padding-top'), 10);
        let pb: number = parseInt(window.getComputedStyle(this.$el).getPropertyValue('padding-bottom'), 10);
        let paddingH: number = pt + pb;

        let h: number = this.$el.clientHeight - paddingH;
        let w: number = this.$el.clientWidth;
        let lines: number = Math.floor(h / lineHeight);

        if (lines > 2) {

            this.$el.style.maxWidth = 'none';
            // use selected class to reserve space for when selected
            this.$el.classList.add(SELECTEDCLASS);
            // create a infinite loop if the parent has 'align-items: stretch'
            (this.$parent.$refs.list as HTMLElement).style.alignItems = 'flex-start';

            do {

                // increment width
                w++;
                this.$el.style.width = w + 'px';

                // update values
                h = this.$el.clientHeight - paddingH;
                lines = Math.floor(h / lineHeight);

            } while (lines > 2);

            // reset styles once completed
            this.$el.classList.remove(SELECTEDCLASS);
            (this.$parent.$refs.list as HTMLElement).style.removeProperty('align-items');
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
