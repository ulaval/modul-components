import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { SWITCH_NAME } from '../component-names';
import WithRender from './switch.sandbox.html';

@WithRender
@Component
export class MSwitchSandbox extends Vue {
}

const SwitchSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SWITCH_NAME}-sandbox`, MSwitchSandbox);
    }
};

export default SwitchSandboxPlugin;
