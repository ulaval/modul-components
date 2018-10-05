import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TEMP_NAME } from '../component-names';
import WithRender from './temp-name.sandbox.html';

@WithRender
@Component
export class MTempNameSandbox extends Vue {
}

const TempNameSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TEMP_NAME}-sandbox`, MTempNameSandbox);
    }
};

export default TempNameSandboxPlugin;
