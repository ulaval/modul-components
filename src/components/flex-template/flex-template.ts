import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './flex-template.html?style=./flex-template.scss';
import { FLEX_TEMPLATE_NAME } from '../component-names';
import { ElementQueries, ElementQueriesMixin } from '../../mixins/element-queries/element-queries';

export enum MFlexTemplateFrom {
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
    @Prop()
    public minHeight: string;
    @Prop({ default: MFlexTemplateFrom.Left })
    public menuFrom: MFlexTemplateFrom;
    @Prop({ default: false })
    public menuOpen: boolean;
    @Prop({ default: false })
    public smallMenu: boolean;
    @Prop({ default: '44px' })
    public smallMenuSize: string;

    private menuOpenCount: number = 0;

    private transitionDelayOpen: boolean = false;
    private paddingPage: string = '';
    private topMenu: string = '';
    private headerHeight: number = 0;
    private headerHidden: boolean = false;
    private scrollPosition: number = 0;

    private internalMenuOpen: boolean = false;
    private menuHasAnim: boolean = false;

    protected mounted(): void {
        document.body.addEventListener('scroll', this.onScroll);
        this.propMenuOpen = this.menuOpen;
        this.scrollPosition = document.body.scrollTop;
        this.setHeaderHeight();
    }

    protected beforeDdestroy(): void {
        document.body.removeEventListener('scroll', this.onScroll);
    }

    @Watch('isEqMaxS')
    private isEqMaxSChanged(value: boolean): void {
        if (this.propMenuOpen) {
            this.animEnter(this.$el, this.doneAnim);
        }
    }

    @Watch('menuOpen')
    private menuOpenChanged(open: boolean): void {
        this.menuHasAnim = true;
        this.propMenuOpen = open;
    }

    private doneAnim(): void {
        return;
    }

    private onScroll() {
        this.adjustFixeMenu();
        this.adjustDynamicHeader();
    }

    private pageOnclick(): void {
        if (this.as<ElementQueriesMixin>().isEqMaxS) {
            if (this.propMenuOpen) {
                // this.propMenuOpen = false;
            }
        }
    }

    private setHeaderHeight(): void {
        this.$nextTick(() => {
            this.headerHeight = (this.$refs.header as HTMLElement).clientHeight;
            this.setSpacing(this.headerHeight);
        });
    }

    private setSpacing(spacing: number): void {
        this.paddingPage = this.propHeaderFixe ? spacing + 'px' : '';
        this.topMenu = ((this.propHeaderFixe || this.propMenuFixe) && !this.isMenuFixeFake) || this.as<ElementQueriesMixin>().isEqMaxS ? spacing + 'px' : '';
    }

    private adjustDynamicHeader() {
        let position: number = this.$el.getBoundingClientRect().top;
        let maxPosition: number = position + this.headerHeight + (this.headerHeight * 1.3);
        let header = this.$refs.header as HTMLElement;
        this.headerHidden = this.propDynamicHeader && (maxPosition <= 0 && !this.propMenuOpen) && (this.scrollPosition >= position);
        this.scrollPosition = position;
    }

    private adjustFixeMenu(): void {
        if (!this.propHeaderFixe && this.propMenuFixe && this.hasHeaderSlot && this.propMenuOpen && !this.as<ElementQueriesMixin>().isEqMaxS) {
            let menuContainer: HTMLElement = this.$refs.menuContainer as HTMLElement;
            let menu: HTMLElement = this.$refs.menu as HTMLElement;
            let topPosition: number = menuContainer.getBoundingClientRect().top;
            setTimeout(() => {
                if (topPosition <= 0) {
                    this.topMenu = Math.abs(topPosition) + 'px';
                } else {
                    this.topMenu = '';
                }
            }, 200);
        }
    }

    private get propDynamicHeader(): boolean {
        return this.dynamicHeader && this.propHeaderFixe;
    }

    private get propMenuOpen(): boolean {
        return this.internalMenuOpen;
    }

    private set propMenuOpen(open: boolean) {
        this.internalMenuOpen = this.hasMenuSlot ? open : false;
    }

    private get propHeaderFixe() {
        return this.hasHeaderSlot && this.headerFixe;
    }

    private get propMenuFixe() {
        return this.hasMenuSlot && this.menuFixe;
    }

    private get propSmallMenu(): boolean {
        if (this.hasMenuSlot) {
            return this.smallMenu;
        }
        return false;
    }

    private get menuOpenWidth(): string {
        if (this.hasMenuSlot) {
            if (this.smallMenu) {
                return this.smallMenuSize;
            }
            return this.menuWidth;
        }
        return '';
    }

    private get propMinHeight(): string {
        return this.minHeight == undefined || this.minHeight == '' ? '100vh' : this.minHeight;
    }

    private get isMenuFromRight(): boolean {
        return this.menuFrom == MFlexTemplateFrom.Right;
    }

    private get isMenuFixeFake(): boolean {
        return !this.propHeaderFixe && this.propMenuFixe;
    }

    private get hasHeaderSlot() {
        return !!this.$slots.header;
    }

    private get hasMenuSlot(): boolean {
        return !!this.$slots.menu;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private animEnter(el: HTMLElement, done): void {
        this.adjustFixeMenu();
        this.adjustDynamicHeader();
        if (!this.as<ElementQueriesMixin>().isEqMaxS) {
            let menuContainer: HTMLElement = this.$refs.menuContainer as HTMLElement;
            let pageContainer: HTMLElement = this.$refs.pageContainer as HTMLElement;
            if (this.menuHasAnim) {
                setTimeout(() => {
                    this.transitionDelayOpen = true;
                    menuContainer.style.width = this.menuOpenWidth;
                    pageContainer.style.width = 'calc(100% - ' + this.menuOpenWidth + ')';
                    setTimeout(() => {
                        done();
                    }, 450);
                }, 20);
            } else {
                this.transitionDelayOpen = true;
                menuContainer.style.width = this.menuOpenWidth;
                pageContainer.style.width = 'calc(100% - ' + this.menuOpenWidth + ')';
                done();
            }

        } else {
            setTimeout(() => {
                this.transitionDelayOpen = true;
            }, 20);
            done();
        }
    }

    private animAfterEnter(el: HTMLElement): void {
        let menuContent: HTMLElement = this.$refs.menuContent as HTMLElement;
        if (this.menuOpenCount != 0) {
            menuContent.focus();
        }
        this.menuOpenCount++;
    }

    private animLeave(el: HTMLElement, done): void {
        this.transitionDelayOpen = false;
        if (!this.as<ElementQueriesMixin>().isEqMaxS) {
            let menuContainer: HTMLElement = this.$refs.menuContainer as HTMLElement;
            let pageContainer: HTMLElement = this.$refs.pageContainer as HTMLElement;
            menuContainer.style.removeProperty('width');
            pageContainer.style.removeProperty('width');
        }
        setTimeout(() => {
            done();
        }, 450);
    }
}

const FlexTemplatePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(FLEX_TEMPLATE_NAME, MFlexTemplate);
    }
};

export default FlexTemplatePlugin;
