import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { LINK_NAME } from '../component-names';
import WithRender from './link.sandbox.html';

@WithRender
@Component
export class MLinkSandbox extends Vue {
}

const LinkSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${LINK_NAME}-sandbox`, MLinkSandbox);
    }
};

export default LinkSandboxPlugin;
