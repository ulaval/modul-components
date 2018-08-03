import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { EDIT_WINDOW_NAME } from '../component-names';
import WithRender from './edit-window.sandbox.html';

@WithRender
@Component
export class MEditWindowSandbox extends Vue {
}

const EditWindowSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${EDIT_WINDOW_NAME}-sandbox`, MEditWindowSandbox);
    }
};

export default EditWindowSandboxPlugin;
