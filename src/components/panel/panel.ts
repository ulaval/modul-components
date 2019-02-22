import ElementQueries from 'css-element-queries/src/ElementQueries';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { PANEL_NAME } from '../component-names';
import WithRender from './panel.html?style=./panel.scss';

export enum MPanelSkin {
    Light = 'light',
    Dark = 'dark',
    Darker = 'darker'
}

const HEADER_RIGHT_CONTENT: string = 'header-right-content';
const MENU: string = 'menu';

@WithRender
@Component
export class MPanel extends Vue {
    @Prop({
        default: MPanelSkin.Light,
        validator: value =>
            value === MPanelSkin.Light ||
            value === MPanelSkin.Dark ||
            value === MPanelSkin.Darker
    })
    public skin: MPanelSkin;

    @Prop()
    public highlighted: boolean;

    @Prop()
    public shadow: boolean;

    @Prop({ default: true })
    public border: boolean;

    @Prop()
    public borderLarge: boolean;

    @Prop({ default: true })
    public padding: boolean;

    @Prop()
    public paddingLarge: boolean;

    @Prop({ default: true })
    public paddingHeader: boolean;

    @Prop({ default: true })
    public paddingBody: boolean;

    @Prop({ default: true })
    public paddingFooter: boolean;

    @Emit('click')
    onClick(): void { }

    protected mounted(): void {
        ElementQueries.init();
    }

    protected beforeDestroy(): void {
        ElementQueries.detach(this.$el);
    }

    private get lightSkin(): boolean {
        return this.skin === MPanelSkin.Light;
    }

    private get darkSkin(): boolean {
        return this.skin === MPanelSkin.Dark;
    }

    private get darkerSkin(): boolean {
        return this.skin === MPanelSkin.Darker;
    }

    private get hasHeader(): boolean {
        if (this.$slots.header || this.$slots[HEADER_RIGHT_CONTENT]) {
            return true;
        }
        return false;
    }

    private get hasHeaderRightContentSlot(): boolean {
        return !!this.$slots[HEADER_RIGHT_CONTENT];
    }

    private get hasHeaderMenuSlot(): boolean {
        return !!this.$slots[MENU];
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get hasPaddingHeader(): boolean {
        return this.paddingHeader && this.padding;
    }

    private get hasPaddingBody(): boolean {
        return this.paddingBody && this.padding;
    }

    private get hasPaddingFooter(): boolean {
        return this.paddingFooter && this.padding;
    }

}

const PanelPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
