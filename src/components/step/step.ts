import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './step.html?style=./step.scss';
import { STEP_NAME } from '../component-names';

@WithRender
@Component
export class MStep extends Vue {
    @Prop({ default: 'success' })
    public type: string;
    private isOpen: boolean;
    @Prop()

    private componentName = STEP_NAME;

    public get hasHeader(): boolean {
        return !!this.$slots['header'];
    }

    public getIcon(): string {
        let icon: string = '';
        switch (this.$props.type) {
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
