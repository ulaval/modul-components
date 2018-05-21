import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TEXTFIELD_NAME } from '../component-names';
import WithRender from './textfield.sandbox.html';

@WithRender
@Component
export class MTextfieldSandbox extends Vue {
    public someData: number = 1;
}

const TextfieldSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TEXTFIELD_NAME}-sandbox`, MTextfieldSandbox);
    }
};

export default TextfieldSandboxPlugin;
