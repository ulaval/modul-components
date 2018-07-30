import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { ModulVue } from '../../utils/vue/vue';
import { NAVBAR_NAME } from '../component-names';
import NavbarItemPlugin, { MNavbarItem } from '../navbar-item/navbar-item';
import WithRender from './navbar.html?style=./navbar.scss';

const OVERFLOWOFFSET: number = 20;

export abstract class BaseNavbar extends ModulVue { }

export interface Navbar {
    model: string;
    mouseEvent: boolean;
    updateValue(value: string): void;
    onMouseover(value: string, event): void;
    onMouseleave(value: string, event): void;
    onClick(value: string, event): void;
}

interface NavbarItems {
    elements: Vue[];
    firstElement: HTMLElement;
    lastElement: HTMLElement;
}

export enum MNavbarSkin {
    Light = 'light',
    Darker = 'darker',
    Darkest = 'darkest',
    LightTab = 'light-tab',
    DarkTab = 'dark-tab',
    Plain = 'plain',
    Arrow = 'arrow'
}

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MNavbar extends BaseNavbar implements Navbar {

    @Prop()
    public selected: string;
    @Prop({
        default: MNavbarSkin.LightTab,
        validator: value =>
            value === MNavbarSkin.Light ||
            value === MNavbarSkin.Darker ||
            value === MNavbarSkin.Darkest ||
            value === MNavbarSkin.LightTab ||
            value === MNavbarSkin.DarkTab ||
            value === MNavbarSkin.Plain ||
            value === MNavbarSkin.Arrow
    })
    public skin: string;
    @Prop({ default: true })
    public margin: boolean;
    @Prop()
    public disabled: boolean;
    @Prop({ default: true })
    public arrowMobile: boolean;
    @Prop({ default: false })
    public mouseEvent: boolean;

    public $refs: {
        buttonRight: HTMLElement,
        list: HTMLElement,
        wrap: HTMLElement
    };

    private animActive: boolean = false;
    private animReady: boolean = false;
    private internalValue: any | undefined = '';
    private showArrowLeft: boolean = false;
    private showArrowRight: boolean = false;
    private computedHeight: number = 0;

    public updateValue(value: any): void {
        this.model = value;
    }

    public onMouseover(value: any, event: Event): void {
        this.$emit('mouseover', value, event);
    }

    public onMouseleave(value: any, event: Event): void {
        this.$emit('mouseleave', value, event);
    }

    public onClick(value: any, event: Event): void {
        this.$emit('click', value, event);
    }

    public get model(): any {
        return this.selected === undefined ? this.internalValue : this.selected;
    }

    public set model(value: any) {
        this.setAndUpdate(value);
        this.$emit('update:selected', value);
    }

    protected created(): void {
        this.internalValue = undefined;
    }

    protected mounted(): void {
        this.scrollToSelected();
        this.setupScrolllH();
        this.as<ElementQueries>().$on('resize', this.setupScrolllH);

        this.$children.forEach((child: Vue) => {
            child.$on('resize', this.setupScrolllH);
        });

        // delay the animation beyond initial load
        setTimeout(() => {
            this.animReady = true;
        }, 0);
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.setupScrolllH);
    }

    private setPosition(element, ref: string): void {
        let positionX: number = element.$el.offsetLeft;
        let width: number = element.$el.clientWidth;
        let localRef: HTMLElement = this.$refs[ref];

        localRef.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
        localRef.style.width = width + 'px';
        this.animActive = true;

    }

    @Watch('selected')
    private setAndUpdate(value): void {
        this.internalValue = value;
        if (this.skin === MNavbarSkin.Light || this.skin === MNavbarSkin.Arrow) {
            let selected: Vue | undefined = this.$children.find(element => element.$props.value === this.selected);
            if (selected) {
                this.setPosition(selected, this.skin);
            }
        }
    }

    private setupScrolllH(): void {
        let listEl: HTMLElement = this.$refs.list;
        let wrapEl: HTMLElement = this.$refs.wrap;
        let maxScrollLeft: number = wrapEl.scrollWidth - wrapEl.clientWidth;

        if (wrapEl.scrollWidth > wrapEl.clientWidth) {
            this.computedHeight = listEl.clientHeight;
            wrapEl.style.height = this.computedHeight + OVERFLOWOFFSET + 'px';
            this.$el.style.height = this.computedHeight + 'px';

            wrapEl.scrollLeft = this.updateScrollPosition();

            if (wrapEl.scrollLeft < maxScrollLeft) {
                this.showArrowRight = true;
            }

            if (wrapEl.scrollLeft > 0) {
                this.showArrowLeft = true;
            }

        } else {
            this.showArrowLeft = false;
            this.showArrowRight = false;
            wrapEl.style.removeProperty('height');
            this.$el.style.removeProperty('height');
        }
    }

    private scrollToSelected(): void {
        this.$children.forEach(element => {
            if (element.$props.value === this.selected) {

                (this.$refs.wrap as HTMLElement).scrollLeft = element.$el.offsetLeft;

                if (this.skin === MNavbarSkin.Light || this.skin === MNavbarSkin.Arrow) {
                    this.setPosition(element, this.skin);
                }

            }
        });
    }

    private updateScrollPosition(): number {
        let offsetLeft: number = 0;
        this.$children.forEach(element => {
            if (element.$props.value === this.selected) {
                offsetLeft = element.$el.offsetLeft;
            }
        });
        return offsetLeft;
    }

    private get buttonSkin(): string {
        return this.skin === 'dark' ? this.skin : 'light';
    }

    private get isLightSkin(): boolean {
        return this.skin === 'light';
    }

    private get isArrowSkin(): boolean {
        return this.skin === 'arrow';
    }

    private navbarItems(): NavbarItems {

        let navbarItems: Vue[] = this.$children.filter(element => {
            return element instanceof MNavbarItem;
        });

        // find first item
        let firstElement: HTMLElement = navbarItems[0].$el;
        // find last item
        let lastElement: HTMLElement = navbarItems[navbarItems.length - 1].$el;

        return {
            elements: navbarItems,
            firstElement: firstElement,
            lastElement: lastElement
        };
    }

    private scrollLeft(): void {
        let container: HTMLElement = this.$refs.wrap;
        let maxScrollLeft: number = container.scrollWidth - container.clientWidth;
        let cLeft: number = container.scrollLeft;
        let outbound: any | undefined;

        let navbarItems: NavbarItems = this.navbarItems();

        // find the previus element outside visible area
        navbarItems.elements.forEach(element => {
            let eLeft: number = element.$el.offsetLeft;
            if (eLeft < cLeft) {
                outbound = element;
            }
        });

        if (outbound) {
            container.scrollLeft = outbound.$el.offsetLeft;
        }

        let pl: number = parseInt(window.getComputedStyle(navbarItems.firstElement).paddingLeft as string, 10);
        if (container.scrollLeft <= pl) {
            this.showArrowLeft = false;
        }

        let pr: number = parseInt(window.getComputedStyle(navbarItems.lastElement).paddingRight as string, 10);
        if (container.scrollLeft < maxScrollLeft - pr) {
            this.showArrowRight = true;
        }

    }

    private scrollRight(): void {
        let container: HTMLElement = this.$refs.wrap;
        let maxScrollLeft: number = container.scrollWidth - container.clientWidth;
        let cRight: number = container.scrollLeft + container.clientWidth;

        let navbarItems: NavbarItems = this.navbarItems();

        // find the next element outside visible area
        let outbound: Vue | undefined = navbarItems.elements.find(element => element.$el.offsetLeft + element.$el.clientWidth > cRight);

        if (outbound) {

            let ml: number = parseInt(window.getComputedStyle(outbound.$el).marginLeft as string, 10);
            let previousElement: HTMLElement | null = outbound.$el.previousElementSibling as HTMLElement;
            let mr: number = parseInt(window.getComputedStyle(previousElement).marginRight as string, 10);

            // get margins values
            let margins: number = ml + mr;

            // get the threshold of visible part of the element
            let threshold: number = cRight - outbound.$el.offsetLeft;

            // move the container scroll
            container.scrollLeft += (outbound.$el.clientWidth + margins) - threshold;
        }

        let pl: number = parseInt(window.getComputedStyle(navbarItems.firstElement).paddingLeft as string, 10);
        if (container.scrollLeft > pl && !this.showArrowLeft) {
            this.showArrowLeft = true;
            // add the arrow width to the scroll the first time it appear
            container.scrollLeft += (this.$refs.buttonRight as HTMLElement).clientWidth;
        }

        let pr: number = parseInt(window.getComputedStyle(navbarItems.lastElement).paddingRight as string, 10);
        if (container.scrollLeft >= maxScrollLeft - pr) {
            this.showArrowRight = false;
        }

    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(NAVBAR_NAME + ' is not ready for production');
        v.use(NavbarItemPlugin);
        v.component(NAVBAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
