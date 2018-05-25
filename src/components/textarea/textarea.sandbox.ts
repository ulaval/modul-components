import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TEXTAREA_NAME } from '../component-names';
import WithRender from './textarea.sandbox.html';

@WithRender
@Component
export class MTextareaSandbox extends Vue {
}

const TextareaSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TEXTAREA_NAME}-sandbox`, MTextareaSandbox);
    }
};

export default TextareaSandboxPlugin;
