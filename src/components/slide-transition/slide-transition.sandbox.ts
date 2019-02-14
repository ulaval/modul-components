import Vue, { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { SLIDE_TRANSITION_NAME } from '../component-names';
import SlideTransitionPlugin from './slide-transition';
import WithRender from './slide-transition.sandbox.html';

@WithRender
@Component
export class MSlideTransitionSandbox extends Vue {
    private model: number = 1;
    private isLeftToRightTransition: boolean = true;

    @Watch('model')
    modelChange(after: number, before: number): void {
        this.isLeftToRightTransition = after > before;
    }
}

const StepTransitionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(SlideTransitionPlugin);
        v.component(`${SLIDE_TRANSITION_NAME}-sandbox`, MSlideTransitionSandbox);
    }
};

export default StepTransitionSandboxPlugin;
