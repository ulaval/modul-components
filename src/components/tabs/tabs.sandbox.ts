import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TABS_NAME } from '../component-names';
import WithRender from './tabs.sandbox.html';

@WithRender
@Component
export class MTabsSandbox extends Vue {
}

const TabsSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TABS_NAME}-sandbox`, MTabsSandbox);
    }
};

export default TabsSandboxPlugin;
