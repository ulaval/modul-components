import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { PROGRESS_NAME } from '../component-names';
import WithRender from './progress.sandbox.html';

@WithRender
@Component
export class MProgressSandbox extends Vue {
}

const ProgressSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${PROGRESS_NAME}-sandbox`, MProgressSandbox);
    }
};

export default ProgressSandboxPlugin;
