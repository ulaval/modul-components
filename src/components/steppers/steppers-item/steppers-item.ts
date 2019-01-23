import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ModulVue } from '../../../utils/vue/vue';
import { STEPPERS_ITEM_NAME } from '../../component-names';
import IconPlugin from '../../icon/icon';
import WithRender from './steppers-item.html?style=./steppers-item.scss';

export enum MSteppersItemState {
    Visited = 'visited',
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
            value === MSteppersItemState.Visited ||
            value === MSteppersItemState.InProgress ||
            value === MSteppersItemState.Disabled
    })
    public state: MSteppersItemState;
    @Prop()
    public iconName: string;
    @Prop()
    public iconTitle: string;
    @Prop({ default: false })
    public completed: boolean;
    @Prop()
    url: string;

    @Watch('state')
    private stateChanged(value?: string[]): void {
        if (this.$parent instanceof BaseSteppers) {
            this.$parent.setAnim(true);
            this.$parent.setLineWidth();
            this.$parent.setAnim(false);
        }
        this.$emit('update:value', this.state);
    }

    private get isVisited(): boolean {
        return this.state === MSteppersItemState.Visited;
    }

    private get isInProgress(): boolean {
        return this.state === MSteppersItemState.InProgress;
    }

    private get isDisabled(): boolean {
        return this.state === MSteppersItemState.Disabled;
    }

    private get isTabIndex(): 0 | -1 {
        return this.isVisited ? 0 : -1;
    }

    private get isLink(): boolean {
        return !!this.url && this.isVisited;
    }

    private get componentToShow(): string {
        return this.isLink ? 'router-link' : 'div';
    }

    private get role(): string | undefined {
        return this.isLink || this.isDisabled ? undefined : 'button';
    }

    private get propUrl(): string | undefined {
        return this.isLink ? this.url : undefined;
    }

    private onClick(event: Event): void {
        if (this.isVisited) {
            this.$emit('click', event);
            (this.$refs.title as HTMLElement).blur();
        }
    }

}


