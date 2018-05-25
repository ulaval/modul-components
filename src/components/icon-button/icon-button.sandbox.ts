import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ICON_BUTTON_NAME } from '../component-names';
import WithRender from './icon-button.sandbox.html';

@WithRender
@Component
export class MIconButtonSandbox extends Vue {
}

const IconButtonSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ICON_BUTTON_NAME}-sandbox`, MIconButtonSandbox);
    }
};

export default IconButtonSandboxPlugin;
