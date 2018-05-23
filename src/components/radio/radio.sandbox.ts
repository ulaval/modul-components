import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { RADIO_NAME } from '../component-names';
import { DynamicSandbox } from './../../../tests/app/sandbox/dynamic-sandbox';
import WithRender from './radio.sandbox.html';

@WithRender
@Component({
    components: { DynamicSandbox }
})
export class MRadioSandbox extends Vue {
    public someData: number = 1;
}

const RadioSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${RADIO_NAME}-sandbox`, MRadioSandbox);
    }
};

export default RadioSandboxPlugin;
