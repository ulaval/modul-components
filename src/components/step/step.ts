import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './step.html?style=./step.scss';
import { STEP_NAME } from '../component-names';

@WithRender
@Component
export class MStep extends Vue {
    @Prop({ default: 'disable' })
    private state: string;
    @Prop()
    private isOpen: boolean;
    @Prop()
    private isObligatory: boolean;

    private componentName = STEP_NAME;
    private aState: string = 'disable';
    private aIsOpen: boolean = false;

    private mounted() {
        this.aState = this.$props.state;
        this.aIsOpen = this.$props.isOpen == undefined ? false : true;
    }

    private openStep(): void {
        this.aIsOpen = true;
    }

    private closeStep(): void {
        this.aIsOpen = false;
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.$props.state) {
            case 'disable':
                icon = 'pastille-crochet';
                break;
            case 'in-progress':
                icon = 'pastille-crochet';
                break;
            case 'success':
                icon = 'pastille-crochet';
                break;
            case 'warning':
                icon = 'pastille-attention';
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
