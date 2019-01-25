import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ElementQueries, ElementQueriesMixin } from '../../mixins/element-queries/element-queries';
import ModulPlugin from '../../utils/modul/modul';
import { ModulVue } from '../../utils/vue/vue';
import { FLEX_TEMPLATE_NAME } from '../component-names';
import WithRender from './flex-template.html?style=./flex-template.scss';


export enum MFlexTemplateOrigin {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MFlexTemplate extends ModulVue {
    @Prop({ default: true })
    public dynamicHeader: boolean;
    @Prop({ default: true })
    public headerFixe: boolean;
    @Prop({ default: '300px' })
    public menuWidth: string;
    @Prop({ default: true })
    public menuFixe: boolean;
    @Prop({
        default: MFlexTemplateOrigin.Left,
        validator: value =>
            value === MFlexTemplateOrigin.Left ||
            value === MFlexTemplateOrigin.Right
    })
    public menuOrigin: MFlexTemplateOrigin;
    @Prop()
    public menuOpen: boolean;
    @Prop()
    public smallMenu: boolean;
    @Prop({ default: '44px' })
    public smallMenuWidth: string;
    @Prop()
    public pageMinHeight: string;

    private menuOpenCount: number = 0;

    private transitionDelayOpen: boolean = false;
    private paddingPage: string = '';
    private topMenu: string = '';
    private headerHeight: number = 0;
    private headerHidden: boolean = false;
    private scrollPosition: number = 0;
    private internalMenuOpen: boolean = false;
    private menuHasAnim: boolean = false;
    private animDynamicHeader: boolean = false;

    protected mounted(): void {
        this.propMenuOpen = this.menuOpen;
        this.scrollPosition = this.$modul.scrollPosition;
        this.$on('isEqMaxS', (value: boolean) => this.isEqMaxSChanged(value));
        this.setHeaderHeight();
        this.$modul.event.$on('scroll', this.onScroll);
        this.$modul.event.$on('resizeDone', this.onResizeDone);
    }

    protected beforeDestroy(): void {
        this.$modul.event.$off('scroll', this.onScroll);
        this.$modul.event.$off('resizeDone', this.onResizeDone);
    }

    @Watch('menuOpen')
    private menuOpenChanged(open: boolean): void {
        this.menuHasAnim = true;
        this.propMenuOpen = open;
        if (open) {
            this.$emit('open');
        } else {
            this.$emit('close');
        }
    }

    @Watch('smallMenu')
    private smallMenuChanged(smallMenu: boolean): void {
        this.menuHasAnim = true;
        if (this.propMenuOpen && !this.as<ElementQueriesMixin>().isEqMaxS) {
            this.setMenuWidth();
        }
    }

    private isEqMaxSChanged(value: boolean): void {
        if (this.propMenuOpen) {
            this.setMenuWidth();
        }
    }

    private onScroll(): void {
        this.adjustFixeMenu();
        this.adjustDynamicHeader();
    }

    private onResizeDone(e): void {
        this.setHeaderHeight();
        this.adjustFixeMenu();
        this.adjustDynamicHeader();
    }

    private setHeaderHeight(): void {
        this.$nextTick(() => {
            if (this.hasHeaderSlot) {
                this.headerHeight = (this.$refs.header as HTMLElement).clientHeight;
                this.setSpacing(this.headerHeight);
            }
        });
    }

    private setSpacing(spacing: number): void {
        this.paddingPage = this.propHeaderFixe ? spacing + 'px' : '';
        this.topMenu = ((this.propHeaderFixe || this.propMenuFixe) && !this.isMenuFixeFake) || this.as<ElementQueriesMixin>().isEqMaxS ? spacing + 'px' : '';
    }

    private adjustDynamicHeader(): void {
        if (this.propDynamicHeader) {
            let position: number = this.$el.getBoundingClientRect().top;
            let maxPosition: number = position + this.headerHeight + 50;
            this.headerHidden = (maxPosition <= 0 && !this.propMenuOpen) && (this.scrollPosition >= position);
            this.scrollPosition = position;
        }
    }

    private adjustFixeMenu(): void {
        if (!this.propHeaderFixe && this.propMenuFixe && this.propMenuOpen && !this.as<ElementQueriesMixin>().isEqMaxS) {
            let menuContainer: HTMLElement = this.$refs.menuContainer as HTMLElement;
            let menu: HTMLElement = this.$refs.menu as HTMLElement;
            let topPosition: number = menuContainer.getBoundingClientRect().top;
            setTimeout(() => {
                if (topPosition <= 0) {
                    this.topMenu = Math.abs(topPosition) + 'px';
                } else {
                    this.topMenu = '';
                }
            }, 60);
        }
    }

    private setMenuWidth(): void {
        let width: string = this.propSmallMenu ? this.smallMenuWidth : this.menuWidth;
        let menuContainer: HTMLElement = this.$refs.menuContainer as HTMLElement;
        let menu: HTMLElement = this.$refs.menu as HTMLElement;
        let pageContainer: HTMLElement = this.$refs.pageContainer as HTMLElement;
        menuContainer.style.width = width;
        menu.style.width = width;
        pageContainer.style.width = 'calc(100% - ' + width + ')';
    }

    private get propMenuOpen(): boolean {
        return this.internalMenuOpen;
    }

    private set propMenuOpen(open: boolean) {
        this.internalMenuOpen = this.hasMenuSlot ? open : false;
    }

    private get propSmallMenu(): boolean {
        return this.hasMenuSlot ? this.smallMenu : false;
    }

    private get propHeaderFixe(): boolean {
        return this.hasHeaderSlot && this.headerFixe;
    }

    private get propMenuFixe(): boolean {
        return this.hasMenuSlot && this.menuFixe;
    }

    private get propDynamicHeader(): boolean {
        return this.dynamicHeader && this.propHeaderFixe;
    }

    private get propPageMinHeight(): string {
        return this.pageMinHeight === undefined || this.pageMinHeight === '' ? '100vh' : this.pageMinHeight;
    }

    private get isMenuOriginRight(): boolean {
        return this.menuOrigin === MFlexTemplateOrigin.Right;
    }

    private get isMenuFixeFake(): boolean {
        return !this.propHeaderFixe && this.propMenuFixe;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasMenuSlot(): boolean {
        return !!this.$slots.menu;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private transitionEnter(el: HTMLElement, done): void {
        this.adjustFixeMenu();
        this.adjustDynamicHeader();
        if (!this.as<ElementQueriesMixin>().isEqMaxS) {
            if (this.menuHasAnim) {
                setTimeout(() => {
                    this.transitionDelayOpen = true;
                    this.setMenuWidth();
                    setTimeout(() => {
                        done();
                    }, 450);
                }, 20);
            } else {
                this.transitionDelayOpen = true;
                this.setMenuWidth();
                done();
            }

        } else {
            setTimeout(() => {
                this.transitionDelayOpen = true;
            }, 20);
            done();
        }
    }

    private transitionAfterEnter(el: HTMLElement): void {
        let menuContent: HTMLElement = this.$refs.menuContent as HTMLElement;
        if (this.menuOpenCount !== 0) {
            menuContent.focus();
        }
        this.menuOpenCount++;
        // tslint:disable-next-line: deprecation
        this.$modul.updateAfterResize();
    }

    private transitionLeave(el: HTMLElement, done): void {
        this.transitionDelayOpen = false;
        if (!this.as<ElementQueriesMixin>().isEqMaxS) {
            let menuContainer: HTMLElement = this.$refs.menuContainer as HTMLElement;
            let pageContainer: HTMLElement = this.$refs.pageContainer as HTMLElement;
            menuContainer.style.removeProperty('width');
            pageContainer.style.removeProperty('width');
        }
        setTimeout(() => {
            // tslint:disable-next-line: deprecation
            this.$modul.updateAfterResize();
            done();
        }, 450);
    }

}

const FlexTemplatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MFlexTemplate will be deprecated in modul v.1.0');
        v.use(ModulPlugin);
        v.component(FLEX_TEMPLATE_NAME, MFlexTemplate);
    }
};

export default FlexTemplatePlugin;
