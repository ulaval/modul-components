import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TEXTAREA_NAME } from '../component-names';
import WithRender from './textarea.sandbox.html';
import TextareaPlugin from './textarea';

@WithRender
@Component
export class MTextareaSandbox extends Vue {
    public test4Model: string = '';
}

const TextareaSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TextareaPlugin);
        v.component(`${TEXTAREA_NAME}-sandbox`, MTextareaSandbox);
    }
};

export default TextareaSandboxPlugin;
