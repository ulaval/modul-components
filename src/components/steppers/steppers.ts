import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './steppers.html?style=./steppers.scss';
import { STEPPERS_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';
import ElementQueries from 'css-element-queries/src/ElementQueries';
import IconPlugin from '../icon/icon';
import LinkPlugin from '../link/link';

@WithRender
@Component({
    mixins: [
        TransitionAccordion
    ]
})
export class MSteppers extends ModulVue {
    @Prop()
    public last: boolean;

    private internalOpen: boolean = false;

}

const SteppersPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(IconPlugin);
        v.use(LinkPlugin);
        v.component(STEPPERS_NAME, MSteppers);
    }
};

export default SteppersPlugin;
