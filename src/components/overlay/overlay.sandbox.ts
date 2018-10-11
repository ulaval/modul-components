import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { OVERLAY_NAME } from '../component-names';
import WithRender from './overlay.sandbox.html';

@WithRender
@Component
export class MOverlaySandbox extends Vue {
}

const OverlaySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${OVERLAY_NAME}-sandbox`, MOverlaySandbox);
    }
};

export default OverlaySandboxPlugin;
