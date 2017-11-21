import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './steppers-item.html?style=./steppers-item.scss';
import { STEPPERS_ITEM_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';
import ElementQueries from 'css-element-queries/src/ElementQueries';
import IconPlugin from '../icon/icon';
import LinkPlugin from '../link/link';

export enum MSteppersItemState {
    Completed = 'completed',
    InProgress = 'in-progress',
    Disabled = 'disabled'
}

@WithRender
@Component({
    mixins: [
        TransitionAccordion
    ]
})
export class MSteppersItem extends ModulVue {
    @Prop({
        default: MSteppersItemState.Disabled,
        validator: value =>
            value == MSteppersItemState.Completed ||
            value == MSteppersItemState.InProgress ||
            value == MSteppersItemState.Disabled
    })
    public status: MSteppersItemState;
    @Prop({ default: 'default' })
    public iconName: string;
    @Prop()
    public iconTitle: string;
    @Prop()
    public last: boolean;

    private internalOpen: boolean = false;

    private get isCompleted() {
        return this.status === MSteppersItemState.Completed;
    }

    private get isInProgress() {
        return this.status === MSteppersItemState.InProgress;
    }

    private get isDisabled() {
        return this.status === MSteppersItemState.Disabled;
    }

}

const SteppersItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(IconPlugin);
        v.use(LinkPlugin);
        v.component(STEPPERS_ITEM_NAME, MSteppersItem);
    }
};

export default SteppersItemPlugin;
