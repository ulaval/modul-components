import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Location } from 'vue-router';
import { ModulVue } from '../../../utils/vue/vue';
import { BaseNavbar, Navbar } from '../navbar';
import NavbarItemHelper from './navbar-item-helper';
import WithRender from './navbar-item.html?style=./navbar-item.scss';

// must be sync with selected css class
const FAKE_SELECTED_CLASS: string = 'm--is-fake-selected';

@WithRender
@Component
export class MNavbarItem extends ModulVue {

    @Prop()
    public value: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public url: string | Location;
    @Prop()
    public ariaHaspopup: boolean;
    @Prop()
    public ariaExpanded: boolean;
    @Prop()
    public ariaControls: string;

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
            this.setDimension();

            if (this.parentNavbar.autoSelect && NavbarItemHelper.isRouterLinkActive(this)) {
                this.parentNavbar.updateValue(this.value);
            }
        } else {
            console.error('m-navbar-item need to be inside m-navbar');
        }

        this.$modul.event.$on('resize', this.setDimension);
    }

    private beforeDestroy(): void {
        this.$modul.event.$off('resize', this.setDimension);
    }

    private get isMultiline(): boolean {
        return this.parentNavbar ? this.parentNavbar.multiline : false;
    }

    @Watch('isMultiline')
    private isMultilineChanged(): void {
        this.setDimension();
    }

    @Watch('$route')
    private routeChanged(): void {
        this.$nextTick(() => {
            if (this.parentNavbar && this.parentNavbar.autoSelect && NavbarItemHelper.isRouterLinkActive(this)) {
                this.parentNavbar.updateValue(this.value);
            }
        });
    }

    private setDimension(): void {
        let itemEl: HTMLElement = this.$refs.item as HTMLElement;
        if (itemEl && itemEl.style) {
            itemEl.style.removeProperty('width');
            itemEl.style.removeProperty('max-width');
            itemEl.style.removeProperty('white-space');

            if (this.isMultiline && ((itemEl.innerText === undefined ? '' : itemEl.innerText).trim().length > 15)) {
                let itemElComputedStyle: any = window.getComputedStyle(itemEl);
                let fontSize: number = parseFloat(itemElComputedStyle.getPropertyValue('font-size'));
                let paddingH: number = parseInt(itemElComputedStyle.getPropertyValue('padding-top'), 10) + parseInt(itemElComputedStyle.getPropertyValue('padding-bottom'), 10);
                // must subtract the padding, create a infinite loop
                let itemElHeight: number = itemEl.clientHeight - paddingH;
                let lines: number = Math.floor(itemElHeight / fontSize);

                if (lines > 2) {
                    // use selected class to reserve space for when selected
                    this.$el.classList.add(FAKE_SELECTED_CLASS);
                    // create a infinite loop if the parent has 'align-items: stretch'
                    (this.$parent.$refs.list as HTMLElement).style.alignItems = 'flex-start';

                    do {
                        itemEl.style.width = itemEl.clientWidth + 1 + 'px'; // increment width

                        // update values
                        itemElHeight = itemEl.clientHeight - paddingH;
                        lines = Math.floor(itemElHeight / fontSize);
                    } while (lines > 2);

                    // reset styles once completed
                    this.$el.classList.remove(FAKE_SELECTED_CLASS);
                    (this.$parent.$refs.list as HTMLElement).style.removeProperty('align-items');
                }
            } else {
                itemEl.style.whiteSpace = 'nowrap';
            }
        }
    }

    private get isDisabled(): boolean {
        return this.disabled;
    }

    public get isSelected(): boolean {
        return !!this.parentNavbar && !this.disabled && this.value === this.parentNavbar.model;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private onClick(event: Event): void {
        if (!this.disabled && this.parentNavbar) {
            this.parentNavbar.onClick(event, this.value);
            if (this.value !== this.parentNavbar.model) {
                this.parentNavbar.updateValue(this.value);
            }
            this.$emit('click', event);
        }
    }

    private onMouseover(event: Event): void {
        if (!this.disabled && this.parentNavbar) {
            this.parentNavbar.onMouseover(event, this.value);
            this.$emit('mouseover', event);
        }

    }

    private onMouseleave(event: Event): void {
        if (!this.disabled && this.parentNavbar) {
            this.parentNavbar.onMouseleave(event, this.value);
            this.$emit('mouseleave', event);
        }
    }

}


