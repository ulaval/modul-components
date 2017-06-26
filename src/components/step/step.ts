import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './step.html?style=./step.scss';
import { STEP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion';

@WithRender
@Component({
    mixins: [
        TransitionAccordion
    ]
})
export class MStep extends Vue implements TransitionAccordionMixin {
    @Prop({ default: 'disable' })
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

    private propsState: string = 'disable';
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
            case 'disable':
                icon = 'default';
                break;
            case 'success':
                icon = 'pastille-crochet';
                break;
            case 'warning':
                icon = 'pastille-crochet-jaune';
                break;
            case 'error':
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
