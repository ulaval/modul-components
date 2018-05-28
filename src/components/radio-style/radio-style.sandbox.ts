import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { RADIO_STYLE_NAME } from '../component-names';
import WithRender from './radio-style.sandbox.html';

@WithRender
@Component
export class MRadioStyleSandbox extends Vue {
}

const RadioStyleSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${RADIO_STYLE_NAME}-sandbox`, MRadioStyleSandbox);
    }
};

export default RadioStyleSandboxPlugin;
