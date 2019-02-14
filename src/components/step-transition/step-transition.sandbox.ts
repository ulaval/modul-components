import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { STEP_TRANSITION_NAME } from '../component-names';
import StepTransitionPlugin from './step-transition';
import WithRender from './step-transition.sandbox.html';


@WithRender
@Component
export class MStepTransitionSandbox extends Vue {
    private model: number = 1;
}

const StepTransitionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(StepTransitionPlugin);
        v.component(`${STEP_TRANSITION_NAME}-sandbox`, MStepTransitionSandbox);
    }
};

export default StepTransitionSandboxPlugin;
