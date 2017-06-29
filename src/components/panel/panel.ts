import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './panel.html?style=./panel.scss';
import { PANEL_NAME } from '../component-names';

@WithRender
@Component
export class MPanel extends Vue {
    @Prop({ default: 'primary' })
    public type: string;
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

    private get hasHeader(): boolean {
        if (this.$slots['header'] || this.$slots['header-content-left'] || this.$slots['header-content-right']) {
            return true;
        }
        return false;
    }

    private get hasContentLeft(): boolean {
        return !!this.$slots['header-content-left'];
    }

    private get hasContentRight(): boolean {
        return !!this.$slots['header-content-right'];
    }

    private get hasFooter(): boolean {
        return !!this.$slots['footer'];
    }
}

const PanelPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
