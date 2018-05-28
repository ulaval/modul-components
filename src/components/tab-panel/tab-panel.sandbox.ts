import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TAB_PANEL_NAME } from '../component-names';
import WithRender from './tab-panel.sandbox.html';

@WithRender
@Component
export class MTabPanelSandbox extends Vue {
}

const TabPanelSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TAB_PANEL_NAME}-sandbox`, MTabPanelSandbox);
    }
};

export default TabPanelSandboxPlugin;
