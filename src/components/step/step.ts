import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './step.html?style=./step.scss';
import { STEP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion';

const STATE_DISABLE: string = 'disable';
const STATE_IN_PROGRESS: string = 'in-progress';
const STATE_SUCCESS: string = 'success';
const STATE_WARNING: string = 'warning';
const STATE_ERROR: string = 'error';

@WithRender
@Component({
    mixins: [
        TransitionAccordion
    ]
})
export class MStep extends Vue {
    @Prop({ default: STATE_DISABLE })
    public state: string;
    @Prop({ default: false })
    public isOpen: boolean;
    @Prop({ default: false })
    public isObligatory: boolean;
    @Prop({ default: 'default' })
    public iconName: string;
    @Prop({ default: false })
    public isLast: boolean;

    public componentName = STEP_NAME;
    public animIsActive: boolean = false;

    private propsState: string = STATE_DISABLE;
    private propsIsOpen: boolean = false;
    private propsIsLast: boolean = false;

    private mounted() {
        this.propsState = this.state;
        this.propsIsOpen = this.isOpen;
        this.propsIsLast = this.isLast;
    }

    private openStep(event): void {
        this.animIsActive = true;
        this.propsIsOpen = true;
        this.$emit('openStep', event);
        event.preventDefault();
    }

    private closeStep(event): void {
        this.animIsActive = true;
        this.propsIsOpen = false;
        this.$emit('closeStep', event);
        event.preventDefault();
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case STATE_DISABLE:
                icon = 'default';
                break;
            case STATE_SUCCESS:
                icon = 'pastille-crochet';
                break;
            case STATE_WARNING:
                icon = 'pastille-crochet-jaune';
                break;
            case STATE_ERROR:
                icon = 'pastille-erreur';
                break;
            default:
                break;
        }
        return icon;
    }
}

const StepPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(STEP_NAME, MStep);
    }
};

export default StepPlugin;
