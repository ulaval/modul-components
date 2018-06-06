import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { BUTTON_GROUP_NAME } from '../component-names';
import WithRender from './button-group.sandbox.html';

@WithRender
@Component
export class MButtonGroupSandbox extends Vue {
}

const ButtonGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${BUTTON_GROUP_NAME}-sandbox`, MButtonGroupSandbox);
    }
};

export default ButtonGroupSandboxPlugin;
