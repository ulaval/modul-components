import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { NAVBAR_NAME } from '../component-names';
import NavbarItemPlugin, { BaseNavbar, Navbar } from '../navbar-item/navbar-item';
import WithRender from './navbar.html?style=./navbar.scss';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const THRESHOLD: number = 2.5;
const OVERFLOWOFFSET: number = 20;
const CSSNAVBARITEM: string = 'm-navbar-item';

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
        let localRef: HTMLElement = this.$refs[ref] as HTMLElement;

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
        let listEl: HTMLElement = this.$refs.list as HTMLElement;
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
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

    private scrollLeft(): void {
        let container: HTMLElement = this.$refs.wrap as HTMLElement;
        let maxScrollLeft: number = container.scrollWidth - container.clientWidth;
        let cLeft: number = container.scrollLeft;
        let outbound: any;

        let navbarItems: Vue[] = this.$children.filter(element => {
            return element.$el.classList.contains(CSSNAVBARITEM);
        });

        // find first item
        let firstElement: HTMLElement = navbarItems[0].$el;
        // find last item
        let lastElement: HTMLElement = navbarItems[navbarItems.length - 1].$el;
        // find the previus element outside visible area
        navbarItems.every(element => {
            let eLeft: number = element.$el.offsetLeft;

            if (eLeft < cLeft) {
                outbound = element;
                return outbound;
            }
        });

        if (outbound) {
            container.scrollLeft = outbound.$el.offsetLeft;
        }

        let ml: number = parseInt(window.getComputedStyle(firstElement).marginLeft as string, 10);
        if (container.scrollLeft <= ml) {
            this.showArrowLeft = false;
        }

        let mr: number = parseInt(window.getComputedStyle(lastElement).marginRight as string, 10);
        if (container.scrollLeft < maxScrollLeft - mr) {
            this.showArrowRight = true;
        }

    }

    private scrollRight(): void {
        let container: HTMLElement = this.$refs.wrap as HTMLElement;
        let maxScrollLeft: number = container.scrollWidth - container.clientWidth;
        let cRight: number = container.scrollLeft + container.clientWidth;

        let navbarItems: Vue[] = this.$children.filter(element => {
            return element.$el.classList.contains(CSSNAVBARITEM);
        });

        // find first item
        let firstElement: HTMLElement = navbarItems[0].$el;
        // find last item
        let lastElement: HTMLElement = navbarItems[navbarItems.length - 1].$el;
        // find the next element outside visible area
        let outbound: Vue | undefined = navbarItems.find(element => element.$el.offsetLeft + element.$el.clientWidth > cRight);

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

        let ml: number = parseInt(window.getComputedStyle(firstElement).marginLeft as string, 10);
        if (container.scrollLeft > ml) {
            this.showArrowLeft = true;
        }

        let mr: number = parseInt(window.getComputedStyle(lastElement).marginRight as string, 10);
        if (container.scrollLeft >= maxScrollLeft - mr) {
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

// boucler sur tous les enfants avec un max-width de x et si leur hauteur est plus grande que Y, retirer le max-w et afficher les flèches
