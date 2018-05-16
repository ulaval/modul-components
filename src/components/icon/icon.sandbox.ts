import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ICON_NAME } from '../component-names';
import WithRender from './icon.sandbox.html';

@WithRender
@Component
export class MIconSandbox extends Vue {
}

const IconSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ICON_NAME}-sandbox`, MIconSandbox);
    }
};

export default IconSandboxPlugin;
