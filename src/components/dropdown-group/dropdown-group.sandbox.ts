import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DROPDOWN_GROUP_NAME } from '../component-names';
import WithRender from './dropdown-group.sandbox.html';

@WithRender
@Component
export class MDropdownGroupSandbox extends Vue {
}

const DropdownGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DROPDOWN_GROUP_NAME}-sandbox`, MDropdownGroupSandbox);
    }
};

export default DropdownGroupSandboxPlugin;
