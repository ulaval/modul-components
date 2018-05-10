import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { RADIO_NAME } from '../component-names';
import WithRender from './radio-sandbox.html';

@WithRender
@Component
export class MRadioSandbox extends Vue {
    public someData: number = 1;
}

const RadioSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${RADIO_NAME}-sandbox`, MRadioSandbox);
    }
};

export default RadioSandboxPlugin;
