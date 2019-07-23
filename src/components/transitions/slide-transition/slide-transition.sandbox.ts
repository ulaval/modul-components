import Vue, { PluginObject } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { SLIDE_TRANSITION_NAME } from '../../component-names';
import SlideTransitionPlugin, { MSlideTransitionDirection } from './slide-transition';
import WithRender from './slide-transition.sandbox.html';

@WithRender
@Component
export class MSlideTransitionSandbox extends Vue {
    private model: number = 1;
    private model2: number = 1;
    private direction: MSlideTransitionDirection = MSlideTransitionDirection.LeftToRight;

    @Watch('model')
    modelChange(after: number, before: number): void {
        this.direction = (after < before) ? MSlideTransitionDirection.LeftToRight : MSlideTransitionDirection.RightToLeft;
    }

    @Watch('model2')
    model2Change(after: number, before: number): void {
        this.direction = (after < before) ? MSlideTransitionDirection.LeftToRight : MSlideTransitionDirection.RightToLeft;
    }
}

const StepTransitionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(SlideTransitionPlugin);
        v.component(`${SLIDE_TRANSITION_NAME}-sandbox`, MSlideTransitionSandbox);
    }
};

export default StepTransitionSandboxPlugin;
