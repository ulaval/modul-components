import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { STEPPERS_NAME } from '../component-names';
import WithRender from './steppers.sandbox.html';

@WithRender
@Component
export class MSteppersSandbox extends Vue {
}

const SteppersSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${STEPPERS_NAME}-sandbox`, MSteppersSandbox);
    }
};

export default SteppersSandboxPlugin;
