import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ElementQueries } from '../../mixins/element-queries/element-queries';
import ModulPlugin from '../../utils/modul/modul';
import { ModulVue } from '../../utils/vue/vue';
import { NAVBAR_ITEM_NAME, NAVBAR_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import { MNavbarItem } from './navbar-item/navbar-item';
import WithRender from './navbar.html?style=./navbar.scss';


const OVERFLOWOFFSET: number = 20;

export abstract class BaseNavbar extends ModulVue { }

export interface Navbar {
    model: string;
    multiline: boolean;
    autoSelect: boolean;
    updateValue(value: string): void;
    onMouseover(event: Event, value: string): void;
    onMouseleave(event: Event, value: string): void;
    onClick(event: Event, value: string): void;
}

interface NavbarItems {
    elements: Vue[];
    firstElement: HTMLElement;
    lastElement: HTMLElement;
}

export enum MNavbarSkin {
    NavMain = 'nav-main',
    NavSub = 'nav-sub',
    NavSoft = 'nav-soft',
    TabLight = 'tab-light',
    TabDark = 'tab-dark',
    TabArrow = 'tab-arrow',
    TabUnderline = 'tab-underline',
    TabSoft = 'tab-soft',
    Plain = 'plain'
}

export enum MNavbarMaxWidth {
    XLarge = '1400px',
    Large = '1200px',
    Regular = '1000px',
    Small = '800px',
    Text = '720px'
}

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MNavbar extends BaseNavbar implements Navbar {

    @Prop()
    public selected: string;
    @Prop({
        default: MNavbarSkin.NavMain,
        validator: value =>
            value === MNavbarSkin.NavMain ||
            value === MNavbarSkin.NavSub ||
            value === MNavbarSkin.NavSoft ||
            value === MNavbarSkin.TabLight ||
            value === MNavbarSkin.TabDark ||
            value === MNavbarSkin.TabArrow ||
            value === MNavbarSkin.TabUnderline ||
            value === MNavbarSkin.TabSoft ||
            value === MNavbarSkin.Plain
    })
    public skin: string;
    @Prop()
    public disabled: boolean;
    @Prop({ default: true })
    public navigationArrow: boolean;
    @Prop({ default: MNavbarMaxWidth.Large })
    public maxWidth: string;
    @Prop({ default: true })
    public multiline: boolean;
    @Prop()
    public titleButtonLeft: string;
    @Prop()
    public titleButtonRight: string;
    @Prop({ default: false })
    public autoSelect: boolean;

    public $refs: {
        buttonRight: HTMLElement,
        buttonLeft: HTMLElement,
        list: HTMLElement,
        wrap: HTMLElement,
        contents: HTMLElement
    };

    private animReady: boolean = false;
    private internalValue: any | undefined = '';
    private showArrowLeft: boolean = false;
    private showArrowRight: boolean = false;
    private computedHeight: number = 0;

    public updateValue(value: any): void {
        this.model = value;
    }

    public onMouseover(event: Event, value: string): void {
        this.$emit('mouseover', event, value);
    }

    public onMouseleave(event: Event, value: string): void {
        this.$emit('mouseleave', event, value);
    }

    public onClick(event: Event, value: string): void {
        this.$emit('click', event, value);
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
        this.setupScrolllH();
        this.as<ElementQueries>().$on('resize', this.setupScrolllH);

        this.$children.forEach((child: Vue) => {
            child.$on('resize', this.setupScrolllH);
        });

        this.$refs.wrap.addEventListener('scroll', this.setDisplayNavigationButtons);
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.setupScrolllH);
        this.$refs.wrap.removeEventListener('scroll', this.setDisplayNavigationButtons);
    }

    @Watch('multiline')
    private multilineChanged(): void {
        // Wait for navbar-item height calculation -> setimension()
        setTimeout(() => {
            this.setupScrolllH();
        });
    }

    private setDisplayNavigationButtons(): void {
        let spaceBeforeDisplayingButton: number = this.isTabLightSkin ? 5 : 0;
        let wrapEl: HTMLElement = this.$refs.wrap;
        if (wrapEl) {
            const maxScrollLeft: number = Math.round(wrapEl.scrollWidth - wrapEl.clientWidth - spaceBeforeDisplayingButton);
            this.showArrowRight = Math.round(wrapEl.scrollLeft) < maxScrollLeft;
            this.showArrowLeft = wrapEl.scrollLeft > spaceBeforeDisplayingButton;
        }
    }

    private get hasArrowRight(): boolean {
        return this.showArrowRight && this.navigationArrow;
    }

    private get hasArrowLeft(): boolean {
        return this.showArrowLeft && this.navigationArrow;
    }

    private setSelectedIndicatorPosition(element, ref: string): void {
        let positionX: number = element.$el.offsetLeft;
        let width: number = element.$el.clientWidth;
        let localRef: HTMLElement = this.$refs[ref];

        localRef.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
        localRef.style.width = width + 'px';
    }

    @Watch('selected')
    private setAndUpdate(value): void {
        this.internalValue = value;
        this.scrollToSelected();
    }

    private setupScrolllH(): void {
        let contentsEl: HTMLElement = this.$refs.contents;
        let wrapEl: HTMLElement = this.$refs.wrap;
        let listEl: HTMLElement = this.$refs.list;

        if (wrapEl.scrollWidth > wrapEl.clientWidth) {
            this.computedHeight = listEl.clientHeight;
            wrapEl.style.height = this.computedHeight + OVERFLOWOFFSET + 'px';
            contentsEl.style.height = this.computedHeight + 'px';
            this.scrollToSelected();
        } else {
            this.showArrowLeft = false;
            this.showArrowRight = false;
            wrapEl.style.removeProperty('height');
            contentsEl.style.removeProperty('height');
        }

        if (!this.animReady) {
            setTimeout(() => {
                this.animReady = true;
            });
        }
    }

    private scrollToSelected(): void {

        this.navbarItems().elements.forEach(element => {
            // Allow time to make sure an item is selected
            setTimeout(() => {
                let wrapEl: HTMLElement = this.$refs.wrap;
                if (element && element.$props.value === this.model && wrapEl) {
                    let buttonLeftWidth: number = this.$refs.buttonLeft && this.hasArrowLeft ? this.$refs.buttonLeft.clientWidth : 0;
                    let buttonRightWidth: number = this.$refs.buttonRight && this.hasArrowRight ? this.$refs.buttonRight.clientWidth : 0;
                    let scrollPositionAlignLeft: number = (element.$el as HTMLElement).offsetLeft - buttonLeftWidth;

                    // Check if selected element is visible in navbar
                    if (wrapEl && wrapEl.clientWidth > ((element.$el as HTMLElement).offsetLeft - wrapEl.scrollLeft + buttonRightWidth)) {
                        // Check if the selected element exceeds on the left side
                        if (((element.$el as HTMLElement).offsetLeft - buttonLeftWidth - wrapEl.scrollLeft) < 0) {
                            wrapEl.scrollLeft = scrollPositionAlignLeft;
                            // Check if the selected element exceeds on the right side
                        } else if (wrapEl.clientWidth < ((element.$el as HTMLElement).offsetLeft - wrapEl.scrollLeft + element.$el.clientWidth + buttonRightWidth)) {
                            wrapEl.scrollLeft = wrapEl.scrollLeft + element.$el.clientWidth + buttonRightWidth - (wrapEl.scrollLeft + wrapEl.clientWidth - (element.$el as HTMLElement).offsetLeft);
                        }
                    } else if (wrapEl) {
                        wrapEl.scrollLeft = scrollPositionAlignLeft;
                    }

                    if (this.skin === MNavbarSkin.TabUnderline || this.skin === MNavbarSkin.TabArrow) {
                        this.setSelectedIndicatorPosition(element, this.skin);
                    }

                    this.setDisplayNavigationButtons();
                }
            });
        });
    }

    private get buttonSkin(): string {
        return this.skin === MNavbarSkin.NavMain || this.skin === MNavbarSkin.NavSub || this.skin === MNavbarSkin.NavSoft || this.skin === MNavbarSkin.TabDark ? 'dark' : 'light';
    }

    private get buttonRipple(): boolean {
        return this.skin === MNavbarSkin.TabUnderline || this.skin === MNavbarSkin.TabArrow || this.skin === MNavbarSkin.TabSoft;
    }

    private get isTabLightSkin(): boolean {
        return this.skin === MNavbarSkin.TabLight;
    }

    private get isTabUnderlineSkin(): boolean {
        return this.skin === MNavbarSkin.TabUnderline;
    }

    private get isTabArrowSkin(): boolean {
        return this.skin === MNavbarSkin.TabArrow;
    }

    private navbarItems(): NavbarItems {
        let navbarItems: Vue[] = this.$children.filter(element => {
            return element instanceof MNavbarItem;
        });

        // find first item
        let firstElement: HTMLElement = navbarItems[0].$el as HTMLElement;
        // find last item
        let lastElement: HTMLElement = navbarItems[navbarItems.length - 1].$el as HTMLElement;

        return {
            elements: navbarItems,
            firstElement: firstElement,
            lastElement: lastElement
        };
    }

    private scrollLeft(): void {
        let wrapEl: HTMLElement = this.$refs.wrap;
        let outbound: Vue | undefined;

        // find the previus element outside visible area
        this.navbarItems().elements.forEach(element => {
            if ((element.$el as HTMLElement).offsetLeft < wrapEl.scrollLeft) {
                outbound = element;
            }
        });

        if (outbound) {
            wrapEl.scrollLeft = (outbound.$el as HTMLElement).offsetLeft - this.$refs.buttonLeft.clientWidth;
        }
    }

    private scrollRight(): void {
        let wrapEl: HTMLElement = this.$refs.wrap;
        let cRight: number = wrapEl.scrollLeft + wrapEl.clientWidth;

        // find the next element outside visible area
        let outbound: Vue | undefined = this.navbarItems().elements.find(element => (element.$el as HTMLElement).offsetLeft + element.$el.clientWidth > cRight);

        if (outbound) {
            // get the threshold of visible part of the element
            let threshold: number = cRight - (outbound.$el as HTMLElement).offsetLeft;

            // move the container scroll
            wrapEl.scrollLeft += (outbound.$el.clientWidth + this.$refs.buttonRight.clientWidth) - threshold;
        }
    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ModulPlugin);
        v.use(IconButtonPlugin);
        v.component(NAVBAR_ITEM_NAME, MNavbarItem);
        v.component(NAVBAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
