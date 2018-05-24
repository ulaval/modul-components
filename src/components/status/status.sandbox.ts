import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { STATUS_NAME } from '../component-names';
import WithRender from './status.sandbox.html';

@WithRender
@Component
export class MStatusSandbox extends Vue {
}

const StatusSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${STATUS_NAME}-sandbox`, MStatusSandbox);
    }
};

export default StatusSandboxPlugin;
