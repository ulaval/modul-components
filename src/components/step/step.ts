import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './step.html?style=./step.scss';
import { STEP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

const STATE_LOCKED: string = 'locked';
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
    @Prop({ default: STATE_LOCKED })
    public state: string;
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: false })
    public obligatory: boolean;
    @Prop({ default: 'default' })
    public iconName: string;
    @Prop({ default: false })
    public last: boolean;

    public componentName = STEP_NAME;
    public animIsActive: boolean = false;

    private propsState: string = STATE_LOCKED;
    private propsOpen: boolean = false;
    private propsLast: boolean = false;

    private mounted() {
        this.propsState = this.state;
        this.propsOpen = this.open;
        this.propsLast = this.last;
    }

    private openStep(event): void {
        this.animIsActive = true;
        this.propsOpen = true;
        this.$emit('openStep', event);
        event.preventDefault();
    }

    private closeStep(event): void {
        this.animIsActive = true;
        this.propsOpen = false;
        this.$emit('closeStep', event);
        event.preventDefault();
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case STATE_LOCKED:
                icon = 'default';
                break;
            case STATE_SUCCESS:
                icon = 'chip-check';
                break;
            case STATE_WARNING:
                icon = 'chip-check-yellow';
                break;
            case STATE_ERROR:
                icon = 'chip-error';
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
