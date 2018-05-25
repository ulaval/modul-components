import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { BUTTON_NAME } from '../component-names';
import WithRender from './button.sandbox.html';

@WithRender
@Component
export class MButtonSandbox extends Vue {
}

const ButtonSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${BUTTON_NAME}-sandbox`, MButtonSandbox);
    }
};

export default ButtonSandboxPlugin;
