import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { INPLACE_EDIT_NAME } from '../component-names';
import WithRender from './inplace-edit.sandbox.html';

@WithRender
@Component
export class MInplaceEditSandbox extends Vue {
}

const InplaceEditSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${INPLACE_EDIT_NAME}-sandbox`, MInplaceEditSandbox);
    }
};

export default InplaceEditSandboxPlugin;
