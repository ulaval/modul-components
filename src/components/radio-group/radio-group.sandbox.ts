import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { RADIO_GROUP_NAME } from '../component-names';
import WithRender from './radio-group.sandbox.html';
import RadioGroupPlugin from './radio-group';

@WithRender
@Component
export class MRadioGroupSandbox extends Vue {
}

const RadioGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(RadioGroupPlugin);
        v.component(`${RADIO_GROUP_NAME}-sandbox`, MRadioGroupSandbox);
    }
};

export default RadioGroupSandboxPlugin;
