import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DROPDOWN_ITEM_NAME } from '../component-names';
import WithRender from './dropdown-item.sandbox.html';

@WithRender
@Component
export class MDropdownItemSandbox extends Vue {
}

const DropdownItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DROPDOWN_ITEM_NAME}-sandbox`, MDropdownItemSandbox);
    }
};

export default DropdownItemSandboxPlugin;
