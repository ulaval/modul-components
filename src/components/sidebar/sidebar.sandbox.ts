import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { SIDEBAR_NAME } from '../component-names';
import WithRender from './sidebar.sandbox.html';

@WithRender
@Component
export class MSidebarSandbox extends Vue {
}

const SidebarSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SIDEBAR_NAME}-sandbox`, MSidebarSandbox);
    }
};

export default SidebarSandboxPlugin;
