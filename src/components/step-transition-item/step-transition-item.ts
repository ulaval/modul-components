
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { STEP_TRANSITION_ITEM_NAME } from '../component-names';
import { BaseStepTransition, StepTransition } from '../step-transition/step-transition';
import WithRender from './step-transition-item.html?style=./step-transition-item.scss';


@WithRender
@Component
export class MStepTransitionItem extends ModulVue {
    @Prop()
    public step: number;

    // should be initialized to be reactive
    // tslint:disable-next-line:no-null-keyword
    private parentStepTransition: StepTransition | null = null;


    protected mounted(): void {
        let parentStepTransition: BaseStepTransition | undefined;
        parentStepTransition = this.getParent<BaseStepTransition>(
            p => p instanceof BaseStepTransition || // these will fail with Jest, but should pass in prod mode
                p.$options.name === 'MStepTransition' // these are necessary for Jest, but the first two should pass in prod mode
        );

        if (parentStepTransition) {
            this.parentStepTransition = (parentStepTransition as any) as StepTransition;
        } else {
            console.error('m-step-transition-item need to be inside m-step-transition');
        }

    }

    public get isSelected(): boolean {
        return !!this.parentStepTransition && this.step === this.parentStepTransition.model;
    }
}

const StepTransitionItemPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(STEP_TRANSITION_ITEM_NAME + ' is not ready for production');
        v.component(STEP_TRANSITION_ITEM_NAME, MStepTransitionItem);
    }
};

export default StepTransitionItemPlugin;
