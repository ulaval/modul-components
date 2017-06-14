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
    public hasShadow: boolean;
    @Prop({ default: true })
    public hasBorder: boolean;
    @Prop({ default: true })
    public hasPadding: boolean;
    @Prop({ default: true })
    public hasPaddingHeader: boolean;
    @Prop({ default: true })
    public hasPaddingBody: boolean;
    @Prop({ default: true })
    public hasPaddingFooter: boolean;

    private componentName: string = PANEL_NAME;

    public get hasHeader(): boolean {
        if (this.$slots['header'] || this.$slots['header-content-left'] || this.$slots['header-content-right']) {
            return true;
        }
        return false;
    }

    public get hasContentLeft(): boolean {
        return !!this.$slots['header-content-left'];
    }

    public get hasContentRight(): boolean {
        return !!this.$slots['header-content-right'];
    }

    public get hasFooter(): boolean {
        return !!this.$slots['footer'];
    }
}

const PanelPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
