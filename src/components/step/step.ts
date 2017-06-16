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

    private propsState: string = 'disable';
    private propsIsOpen: boolean = false;
    private propsIsLast: boolean = false;
    private animIsActive: boolean = false;

    private mounted() {
        this.propsState = this.$props.state;
        this.propsIsOpen = this.$props.isOpen;
        this.propsIsLast = this.$props.isLast;
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
        switch (this.$props.state) {
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

    private animEnter(el, done): void {
        if (this.animIsActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            }, 2);
        } else {
            done();
        }
    }

    private animAfterEnter(el): void {
        if (this.animIsActive) {
            setTimeout(() => {
                el.style.maxHeight = 'none';
            }, 300);
        }
    }

    private animLeave(el, done): void {
        if (this.animIsActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            setTimeout(() => {
                el.style.maxHeight = '0';
            }, 0);
            setTimeout(() => {
                done();
            }, 300);
        } else {
            done();
        }
    }
}

const StepPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(STEP_NAME, MStep);
    }
};

export default StepPlugin;
