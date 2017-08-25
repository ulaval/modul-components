import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './tooltip.html?style=./tooltip.scss';
import { TOOLTIP_NAME } from '../component-names';

@WithRender
@Component
export class MTooltip extends Vue {
    @Prop({ default: 4 })
    public maxNumberOfLine: number;
    @Prop()
    public label: string;

    public componentName = TOOLTIP_NAME;

    protected mounted(): void {

    }
}

const TooltipPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TOOLTIP_NAME, MTooltip);
    }
};

export default TooltipPlugin;
