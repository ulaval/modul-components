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
    Light = 'light',
    Arrow = 'arrow',
    Darker = 'darker',
    Darkest = 'darkest',
    Soft = 'soft',
    Simple = 'simple',
    LightTab = 'light-tab',
    DarkTab = 'dark-tab',
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
        default: MNavbarSkin.Light,
        validator: value =>
            value === MNavbarSkin.Light ||
            value === MNavbarSkin.Arrow ||
            value === MNavbarSkin.Soft ||
            value === MNavbarSkin.Simple ||
            value === MNavbarSkin.Darker ||
            value === MNavbarSkin.Darkest ||
            value === MNavbarSkin.LightTab ||
            value === MNavbarSkin.DarkTab ||
            value === MNavbarSkin.Plain
    })
    public skin: string;
    @Prop()
    public disabled: boolean;
    @Prop({ default: true })
    public navigationArrow: boolean;
    @Prop({ default: MNavbarMaxWidth.Large })
    public maxWidth: string;

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

        // delay the animation beyond initial load
        setTimeout(() => {
            this.scrollToSelected();
             // delay the animation beyond initial load
            setTimeout(() => {
                this.animReady = true;

            });
        });

        this.$refs.wrap.addEventListener('scroll', this.setDisplayButtonArrrow);
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.setupScrolllH);
        this.$refs.wrap.removeEventListener('scroll', this.setDisplayButtonArrrow);
    }

    private setDisplayButtonArrrow(): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let maxScrollLeft: number = wrapEl.scrollWidth - wrapEl.clientWidth;

        this.showArrowRight = wrapEl.scrollLeft < maxScrollLeft;

        this.showArrowLeft = wrapEl.scrollLeft > 0;
    }

    private get hasArrowRight(): boolean {
        return this.showArrowRight && this.navigationArrow;
    }

    private get hasArrowLeft(): boolean {
        return this.showArrowLeft && this.navigationArrow;
    }

    private setPosition(element, ref: string): void {
        let positionX: number = element.$el.offsetLeft;
        let width: number = element.$el.clientWidth;
        let localRef: HTMLElement = this.$refs[ref];

        localRef.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
        localRef.style.width = width + 'px';
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
        let contentsEl: HTMLElement = this.$refs.contents;
        let wrapEl: HTMLElement = this.$refs.wrap;
        let listEl: HTMLElement = this.$refs.list;

        if (wrapEl.scrollWidth > wrapEl.clientWidth) {
            this.computedHeight = listEl.clientHeight;
            wrapEl.style.height = this.computedHeight + OVERFLOWOFFSET + 'px';
            contentsEl.style.height = this.computedHeight + 'px';

            this.scrollToSelected();

            this.setDisplayButtonArrrow();

        } else {
            this.showArrowLeft = false;
            this.showArrowRight = false;
            wrapEl.style.removeProperty('height');
            contentsEl.style.removeProperty('height');
        }
    }

    private scrollToSelected(): void {
        this.$children.forEach(element => {
            if (element.$props.value === this.selected) {
                let boutonWidth: number = this.hasArrowLeft ? this.$refs.buttonLeft.clientWidth : 0;
                this.$refs.wrap.scrollLeft = element.$el.offsetLeft - boutonWidth;

                if (this.skin === MNavbarSkin.Light || this.skin === MNavbarSkin.Arrow) {
                    this.setPosition(element, this.skin);
                }
            }
        });
    }

    private get buttonSkin(): string {
        return this.skin === MNavbarSkin.Soft || this.skin === MNavbarSkin.Darker || this.skin === MNavbarSkin.Darkest || this.skin === MNavbarSkin.DarkTab ? 'dark' : 'light';
    }

    private get buttonRipple(): boolean {
        return this.skin === MNavbarSkin.Light || this.skin === MNavbarSkin.Arrow || this.skin === MNavbarSkin.Simple;
    }

    private get isLightSkin(): boolean {
        return this.skin === MNavbarSkin.Light;
    }

    private get isArrowSkin(): boolean {
        return this.skin === MNavbarSkin.Arrow;
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
        let wrapEl: HTMLElement = this.$refs.wrap;
        let outbound: Vue | undefined;

        // find the previus element outside visible area
        this.navbarItems().elements.forEach(element => {
            if (element.$el.offsetLeft < wrapEl.scrollLeft) {
                outbound = element;
            }
        });

        if (outbound) {
            wrapEl.scrollLeft = outbound.$el.offsetLeft - this.$refs.buttonLeft.clientWidth;
        }

        this.setDisplayButtonArrrow();
    }

    private scrollRight(): void {
        let wrapEl: HTMLElement = this.$refs.wrap;
        // let maxScrollLeft: number = wrapEl.scrollWidth - wrapEl.clientWidth;
        let cRight: number = wrapEl.scrollLeft + wrapEl.clientWidth;

        // find the next element outside visible area
        let outbound: Vue | undefined = this.navbarItems().elements.find(element => element.$el.offsetLeft + element.$el.clientWidth > cRight);

        if (outbound) {
            // get the threshold of visible part of the element
            let threshold: number = cRight - outbound.$el.offsetLeft;

            // move the container scroll
            wrapEl.scrollLeft += (outbound.$el.clientWidth + this.$refs.buttonRight.clientWidth) - threshold;
        }
        this.setDisplayButtonArrrow();
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
