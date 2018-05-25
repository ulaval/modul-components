import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { LIMIT_TEXT_NAME } from '../component-names';
import WithRender from './limit-text.sandbox.html';

@WithRender
@Component
export class MLimitTextSandbox extends Vue {
}

const LimitTextSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${LIMIT_TEXT_NAME}-sandbox`, MLimitTextSandbox);
    }
};

export default LimitTextSandboxPlugin;
