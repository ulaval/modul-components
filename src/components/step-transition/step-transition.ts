
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { STEP_TRANSITION_NAME } from '../component-names';
import WithRender from './step-transition.html?style=./step-transition.scss';

export abstract class BaseStepTransition extends ModulVue { }

export interface StepTransition {
    model: number;
}

@WithRender
@Component
export class MStepTransition extends ModulVue implements StepTransition {
    @Prop()
    public stepSelected: number;
    @Prop({ default: 0 })
    public scrollToOffset: number; // the offset to add (in case of a sticky header)

    private internalStepSelected: number = 0;
    private interneIsLeftToRightTransition: boolean = true;

    protected created(): void {
        this.model = this.stepSelected;
    }

    @Watch('stepSelected')
    private updateStepSelected(stepSelected: number): void {
        this.interneIsLeftToRightTransition = stepSelected > this.model;
        this.model = stepSelected;
    }

    get isLeftToRightTransition(): boolean {
        return this.interneIsLeftToRightTransition;
    }


    public get model(): number {
        return this.stepSelected === 0 ? this.internalStepSelected : this.stepSelected;
    }

    public set model(value: number) {
        this.internalStepSelected = value;
        this.$emit('update:stepSelected', value);
    }

    private transitionEnter(el: HTMLElement): void {
        this.$scrollTo.goTo(this.$el, this.scrollToOffset, ScrollToDuration.Regular);
        setTimeout(() => {
            this.transitionBeforeLeave(el);
        }, 100);
    }

    private transitionAfterEnter(): void {
        this.$el.style.removeProperty('height');
    }

    private transitionBeforeLeave(el: HTMLElement): void {
        this.$el.style.height = this.getHauteurEl(el) + 'px';
    }

    private transitionAfterLeave(): void {
        this.transitionAfterEnter();
    }

    private getHauteurEl(el): number {
        let elComputedStyle: any = window.getComputedStyle(el);
        return parseInt(elComputedStyle.height as string, 10)
            + parseInt(elComputedStyle.marginTop as string, 10)
            + parseInt(elComputedStyle.marginBottom as string, 10)
            + parseInt(elComputedStyle.paddingTop as string, 10)
            + parseInt(elComputedStyle.paddingBottom as string, 10)
            + parseInt(elComputedStyle.borderTopWidth as string, 10)
            + parseInt(elComputedStyle.borderBottomWidth as string, 10);
    }
}

const StepTransitionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(STEP_TRANSITION_NAME + ' is not ready for production');
        v.component(STEP_TRANSITION_NAME, MStepTransition);
    }
};

export default StepTransitionPlugin;
