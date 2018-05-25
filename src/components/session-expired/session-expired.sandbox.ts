import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { SESSION_EXPIRED_NAME } from '../component-names';
import WithRender from './session-expired.sandbox.html';

@WithRender
@Component
export class MSessionExpiredSandbox extends Vue {
}

const SessionExpiredSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SESSION_EXPIRED_NAME}-sandbox`, MSessionExpiredSandbox);
    }
};

export default SessionExpiredSandboxPlugin;
