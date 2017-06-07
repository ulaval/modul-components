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
    @Prop({ default: false })
    public hasShadow: boolean;
    @Prop({ default: false })
    public hasBorder: boolean;
    @Prop({ default: false })
    public hasPadding: boolean;
    @Prop({ default: false })
    public hasPaddingHeader: boolean;
    @Prop({ default: false })
    public hasPaddingBody: boolean;

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
}

const PanelPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
