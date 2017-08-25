import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './flex-template.html?style=./flex-template.scss';
import { FLEX_TEMPLATE_NAME } from '../component-names';

export enum MFlexTemplateFrom {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component
export class MFlexTemplate extends Vue {
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

    private get fromRight(): boolean {
        return this.from == MFlexTemplateFrom.Right;
    }

    private get propMenuOpen(): boolean {
        if (this.hasNavSlot) {
            if (this.menuOpen) {
                this.valueMenuWidth = this.smallMenu ? this.smallMenuSize : this.propMenuWidth;
                this.$nextTick(() => {
                    let navEl: HTMLElement = this.$refs.nav as HTMLElement;
                    navEl.setAttribute('tabindex', '0');
                    if (this.menuOpenCount != 0) {
                        navEl.focus();
                    }
                });
                this.$emit('menuOpen');
            } else {
                this.valueMenuWidth = '0';

                this.$nextTick(() => {
                    let navEl: HTMLElement = this.$refs.nav as HTMLElement;
                    if (navEl.hasAttribute('tabindex')) {
                        navEl.removeAttribute('tabindex');
                    }
                });

                this.$emit('menuClose');
            }

            this.$nextTick(() => {
                this.menuOpenCount++;
            });

            return this.menuOpen;
        }

        return false;
    }

    private get propSmallMenu(): boolean {
        if (this.smallMenu) {
            this.valueMenuWidth = this.smallMenuSize;
        }
        return this.smallMenu;
    }

    private get propMenuWidth(): string {
        return this.menuWidth;
    }

    private get hasNavSlot(): boolean {
        return !!this.$slots.nav;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }
}

const FlexTemplatePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(FLEX_TEMPLATE_NAME, MFlexTemplate);
    }
};

export default FlexTemplatePlugin;
