import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './panel.html?style=./panel.scss';
import { PANEL_NAME } from '../component-names';

const MODE_PRIMARY: string = 'primary';
const MODE_SECONDARY: string = 'secondary';

@WithRender
@Component
export class MPanel extends Vue {
    @Prop({ default: MODE_PRIMARY })
    public mode: string;
    @Prop({ default: true })
    public shadow: boolean;
    @Prop({ default: true })
    public border: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    public componentName: string = PANEL_NAME;

    private get propMode(): string {
        return this.mode == MODE_PRIMARY ? MODE_PRIMARY : MODE_SECONDARY;
    }

    private get hasHeader(): boolean {
        if (this.$slots['header'] || this.$slots['header-content-left'] || this.$slots['header-content-right']) {
            return true;
        }
        return false;
    }

    private get hasHeaderContentLeftSlot(): boolean {
        return !!this.$slots['header-content-left'];
    }

    private get hasHeaderContentRightSlot(): boolean {
        return !!this.$slots['header-content-right'];
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
    install(v, options) {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
