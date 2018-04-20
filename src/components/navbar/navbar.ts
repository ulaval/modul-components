import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './navbar.html?style=./navbar.scss';
import { NAVBAR_NAME, NAVBAR_ITEM_NAME } from '../component-names';
import NavbarItemPlugin, { BaseNavbar, Navbar } from '../navbar-item/navbar-item';
import { ElementQueries, ElementQueriesMixin } from '../../mixins/element-queries/element-queries';
import { ComputedOptions } from 'vue/types/options';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const THRESHOLD: number = 2.5;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

export enum MNavbarSkin {
    Light = 'light',
    Dark = 'dark',
    LightTab = 'light-tab',
    DarkTab = 'dark-tab',
    Plain = 'plain',
    Simple = 'simple',
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
            value == MNavbarSkin.Light ||
            value == MNavbarSkin.Dark ||
            value == MNavbarSkin.LightTab ||
            value == MNavbarSkin.DarkTab ||
            value == MNavbarSkin.Plain ||
            value == MNavbarSkin.Simple ||
            value == MNavbarSkin.Arrow
    })
    public skin: string;
    @Prop({ default: true })
    public margin: boolean;
    @Prop()
    public disabled: boolean;
    @Prop({ default: true })
    public arrowMobile: boolean;
    @Prop({ default: false })
    public mouseover: boolean;

    private animActive: boolean = false;
    private internalValue: any | undefined = '';
    private hasScrolllH: boolean = false;
    private computedHeight: number = 0;

    public updateValue(value: any): void {
        this.model = value;
    }

    public onMouseOver(value: any, event: Event): void {
        this.$emit('mouseover', value, event);
    }

    public onClick(value: any, event: Event): void {
        this.$emit('click', value, event);
    }

    public get model(): any {
        return this.selected == undefined ? this.internalValue : this.selected;
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
    }

    protected beforeDestroy(): void {
        this.as<ElementQueries>().$off('resize', this.setupScrolllH);
    }

    private scrollToSelected(): void {
        this.$children.forEach(element => {
            if (element.$props.value === this.selected) {

                (this.$refs.wrap as HTMLElement).scrollLeft = element.$el.offsetLeft;

                if (this.skin == MNavbarSkin.Light) {
                    this.setPosition(element, 'line');
                }
                if (this.skin == MNavbarSkin.Arrow) {
                    this.setPosition(element, 'arrow');
                }
            }
        });
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
    }

    private setupScrolllH(): void {
        let listEl: HTMLElement = this.$refs.list as HTMLElement;
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let elComputedStyle: any = (this.$el as any).currentStyle || window.getComputedStyle(this.$el);
        let width: number = this.$el.clientWidth - parseInt(elComputedStyle.paddingLeft, 10) -
            parseInt(elComputedStyle.paddingRight, 10) - parseInt(elComputedStyle.borderLeftWidth, 10) -
            parseInt(elComputedStyle.borderRightWidth, 10);
        if (width < listEl.clientWidth) {
            this.computedHeight = listEl.clientHeight;
            this.hasScrolllH = true;
            wrapEl.style.height = this.computedHeight + 40 + 'px';
            this.$el.style.height = this.computedHeight + 'px';
        } else {
            this.hasScrolllH = false;
            wrapEl.style.removeProperty('height');
            this.$el.style.removeProperty('height');
        }
    }

    private get ComputedHeight(): string {
        return this.computedHeight + 'px';
    }

    private get buttonSkin(): string {
        return this.skin == 'dark' ? this.skin : 'light';
    }

    private get isLightSkin(): boolean {
        return this.skin == 'light';
    }

    private get isArrowSkin(): boolean {
        return this.skin == 'arrow';
    }

    private scrollLeft(event: MouseEvent): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let btnsWidth: any = ((this.$refs.buttonLeft as ModulVue).$el as HTMLElement).clientWidth + ((this.$refs.buttonRight as ModulVue).$el as HTMLElement).clientWidth;
        wrapEl.scrollLeft = wrapEl.scrollLeft - ((this.$el.clientWidth - btnsWidth) / THRESHOLD);
    }

    private scrollRight(event: MouseEvent): void {
        let wrapEl: HTMLElement = this.$refs.wrap as HTMLElement;
        let btnsWidth: any = ((this.$refs.buttonLeft as ModulVue).$el as HTMLElement).clientWidth + ((this.$refs.buttonRight as ModulVue).$el as HTMLElement).clientWidth;
        wrapEl.scrollLeft = wrapEl.scrollLeft + ((this.$el.clientWidth - btnsWidth) / THRESHOLD);
    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(NAVBAR_NAME + ' is not ready for production');
        v.use(NavbarItemPlugin);
        v.component(NAVBAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
