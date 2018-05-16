import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ICON_FILE_NAME } from '../component-names';
import WithRender from './icon-file.sandbox.html';

@WithRender
@Component
export class MIconFileSandbox extends Vue {
}

const IconFileSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ICON_FILE_NAME}-sandbox`, MIconFileSandbox);
    }
};

export default IconFileSandboxPlugin;
