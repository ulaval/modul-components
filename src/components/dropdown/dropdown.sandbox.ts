import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DROPDOWN_NAME } from '../component-names';
import WithRender from './dropdown.sandbox.html';

@WithRender
@Component
export class MDropdownSandbox extends Vue {
    // tslint:disable-next-line:no-null-keyword
    public nullValue: null = null;
    public undefinedValue: undefined = undefined;
}

const DropdownSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DROPDOWN_NAME}-sandbox`, MDropdownSandbox);
    }
};

export default DropdownSandboxPlugin;
