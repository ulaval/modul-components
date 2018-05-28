import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { STEP_NAME } from '../component-names';
import WithRender from './step.sandbox.html';

@WithRender
@Component
export class MStepSandbox extends Vue {
}

const StepSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${STEP_NAME}-sandbox`, MStepSandbox);
    }
};

export default StepSandboxPlugin;
