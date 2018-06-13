import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TREE_NAME } from '../component-names';
import WithRender from './tree.sandbox.html';

@WithRender
@Component
export class MTreeSandbox extends Vue {
}

const TreeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TREE_NAME}-sandbox`, MTreeSandbox);
    }
};

export default TreeSandboxPlugin;
