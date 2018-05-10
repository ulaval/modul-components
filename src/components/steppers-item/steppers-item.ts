import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { STEPPERS_ITEM_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './steppers-item.html?style=./steppers-item.scss';

export enum MSteppersItemState {
    Completed = 'completed',
    InProgress = 'in-progress',
    Disabled = 'disabled'
}

export abstract class BaseSteppers extends ModulVue {
    abstract setLineWidth(): void;
    abstract setAnim(value): void;
}

@WithRender
@Component
export class MSteppersItem extends ModulVue {
    @Prop({
        default: MSteppersItemState.Disabled,
        validator: value =>
            value === MSteppersItemState.Completed ||
            value === MSteppersItemState.InProgress ||
            value === MSteppersItemState.Disabled
    })
    public state: MSteppersItemState;
    @Prop()
    public iconName: string;
    @Prop()
    public iconTitle: string;

    @Watch('state')
    private stateChanged(value?: string[]): void {
        if (this.$parent instanceof BaseSteppers) {
            this.$parent.setAnim(true);
            this.$parent.setLineWidth();
            this.$parent.setAnim(false);
        }
        this.$emit('update:value', this.state);
    }

    private get isCompleted() {
        return this.state === MSteppersItemState.Completed;
    }

    private get isInProgress() {
        return this.state === MSteppersItemState.InProgress;
    }

    private get isDisabled() {
        return this.state === MSteppersItemState.Disabled;
    }

    private get isTabIndex() {
        return this.state === MSteppersItemState.Completed ? 0 : -1;
    }

    private onClick(event: Event): void {
        if (this.state === MSteppersItemState.Completed) {
            this.$emit('click', event);
            (this.$refs.title as HTMLElement).blur();
        }
    }

}

const SteppersItemPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.component(STEPPERS_ITEM_NAME, MSteppersItem);
    }
};

export default SteppersItemPlugin;
