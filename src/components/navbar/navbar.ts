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

export enum MNavbarSkin {
    Light = 'light',
    Dark = 'dark',
    Tab = 'tab',
    Plain = 'plain',
    Soft = 'soft',
    Simple = 'simple',
    Arrow = 'arrow'
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
        default: MNavbarSkin.Tab,
        validator: value =>
            value === MNavbarSkin.Light ||
            value === MNavbarSkin.Dark ||
            value === MNavbarSkin.Tab ||
            value === MNavbarSkin.Plain ||
            value === MNavbarSkin.Soft ||
            value === MNavbarSkin.Simple ||
            value === MNavbarSkin.Arrow
    })
    public skin: string;
    @Prop()
    public disabled: boolean;
    @Prop({ default: true })
    public navigationArrow: boolean;
    @Prop({ default: false })
    public mouseEvent: boolean;
    @Prop({ default: MNavbarMaxWidth.Large })
    public maxWidth: string;

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
        this.setupScrolllH();
        this.as<ElementQueries>().$on('resize', this.setupScrolllH);
        (this.$refs.wrap as HTMLElement).addEventListener('scroll', this.setDisplayButtonArrrow);
        setTimeout(() => {
            this.scrollToSelected();

             // delay the animation beyond initial load
            setTimeout(() => {
                this.animReady = true;
            });
        });
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.setupScrolllH);
    }

    private setDisplayButtonArrrow(): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let maxScrollLeft: number = wrapEl.scrollWidth - wrapEl.clientWidth;

        this.showArrowRight = wrapEl.scrollLeft < maxScrollLeft;

        this.showArrowLeft = wrapEl.scrollLeft > 0;
    }

    private setPosition(element, ref: string): void {
        let positionX: number = element.$el.offsetLeft;
        let width: number = element.$el.clientWidth;
        let localRef: HTMLElement = this.$refs[ref] as HTMLElement;

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
        let contentsEl: HTMLElement = this.$refs.contents as HTMLElement;
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let listEl: HTMLElement = this.$refs.list as HTMLElement;
        let maxScrollLeft: number = wrapEl.scrollWidth - wrapEl.clientWidth;

        if (wrapEl.scrollWidth > wrapEl.clientWidth) {
            this.computedHeight = listEl.clientHeight;
            wrapEl.style.height = this.computedHeight + OVERFLOWOFFSET + 'px';
            contentsEl.style.height = this.computedHeight + 'px';

            wrapEl.scrollLeft = this.updateScrollPosition();

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
        return this.skin === MNavbarSkin.Dark ? MNavbarSkin.Dark : MNavbarSkin.Light;
    }

    private get isLightSkin(): boolean {
        return this.skin === MNavbarSkin.Light;
    }

    private get isArrowSkin(): boolean {
        return this.skin === MNavbarSkin.Arrow;
    }

    private scrollLeft(): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        wrapEl.scrollLeft = wrapEl.scrollLeft - (wrapEl.clientWidth);
        this.setDisplayButtonArrrow();
    }

    private scrollRight(): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        wrapEl.scrollLeft = wrapEl.scrollLeft + (wrapEl.clientWidth);
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
