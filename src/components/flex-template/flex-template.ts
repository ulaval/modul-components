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
    @Prop()
    public paddingTop: string;
    @Prop({ default: '300px' })
    public menuWidth: string;
    @Prop({ default: '100vh' })
    public minHeight: string;
    @Prop({ default: MFlexTemplateFrom.Left })
    public from: MFlexTemplateFrom;
    @Prop({ default: false })
    public menuOpen: boolean;
    @Prop({ default: false })
    public smallMenu: boolean;
    @Prop({ default: '44px' })
    public smallMenuSize: string;

    private valueMenuWidth: string;
    private menuOpenCount: number = 0;

    private animOpen: boolean = false;

    @Watch('isEqMaxS')
    private isEqMaxSChanged(value: boolean): void {
        if (this.propMenuOpen) {
            this.animEnter(this.$el, this.doneAnim);
        }
    }

    private doneAnim(): void {
        return;
    }

    private get propMenuOpen(): boolean {
        if (this.hasNavSlot) {
            return this.menuOpen;
        }
        return false;
    }

    private get propSmallMenu(): boolean {
        if (this.hasNavSlot) {
            return this.smallMenu;
        }
        return false;
    }

    private get fromRight(): boolean {
        return this.from == MFlexTemplateFrom.Right;
    }

    private get menuOpenWidth(): string {
        if (this.hasNavSlot) {
            if (this.smallMenu) {
                return this.smallMenuSize;
            }
            return this.menuWidth;
        }
        return '';
    }

    private get hasNavSlot(): boolean {
        return !!this.$slots.nav;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private animEnter(el: HTMLElement, done): void {
        if (!this.as<ElementQueriesMixin>().isEqMaxS) {
            let navContainer: HTMLElement = this.$refs.navContainer as HTMLElement;
            let pageContainer: HTMLElement = this.$refs.pageContainer as HTMLElement;
            setTimeout(() => {
                this.animOpen = true;
                navContainer.style.width = this.menuOpenWidth;
                pageContainer.style.width = 'calc(100% - ' + this.menuOpenWidth + ')';
                setTimeout(() => {
                    done();
                }, 450);
            }, 10);
        } else {
            setTimeout(() => {
                this.animOpen = true;
            }, 10);
            done();
        }
    }

    private animAfterEnter(el: HTMLElement): void {
        let navContent: HTMLElement = this.$refs.navContent as HTMLElement;
        if (this.menuOpenCount != 0) {
            navContent.focus();
        }
    }

    private animLeave(el: HTMLElement, done): void {
        this.animOpen = false;
        if (!this.as<ElementQueriesMixin>().isEqMaxS) {
            let navContainer: HTMLElement = this.$refs.navContainer as HTMLElement;
            let pageContainer: HTMLElement = this.$refs.pageContainer as HTMLElement;
            navContainer.style.removeProperty('width');
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
