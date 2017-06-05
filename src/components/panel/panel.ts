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
    public noShadow: boolean;
    @Prop({ default: false })
    public noPadding: boolean;

    private componentName: string = PANEL_NAME;
    private lorem: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas iaculis nibh eu diam pellentesque lobortis. Duis mattis vel orci at luctus. Fusce vitae eros quis diam iaculis imperdiet quis vitae sapien. Aliquam blandit commodo arcu et vehicula. Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec vehicula condimentum elementum. Sed laoreet est eget lorem tristique condimentum. Vestibulum at odio orci. Duis nisl erat, aliquam non tortor et, dapibus maximus nulla. Mauris lobortis, orci nec lobortis faucibus, nisi justo eleifend erat, sed convallis velit mi non lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";

    public get hasHeader(): boolean {
        return !!this.$slots['header'];
    }
}

const PanelPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_NAME, MPanel);
    }
};

export default PanelPlugin;
