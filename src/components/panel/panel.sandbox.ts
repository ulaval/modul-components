import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PANEL_NAME } from '../component-names';
import PanelPlugin from './panel';
import WithRender from './panel.sandbox.html';


@WithRender
@Component
export class MPanelSandbox extends Vue {
}

const PanelSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PanelPlugin);
        v.component(`${PANEL_NAME}-sandbox`, MPanelSandbox);
    }
};

export default PanelSandboxPlugin;
