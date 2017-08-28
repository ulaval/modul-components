import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './tooltip.html?style=./tooltip.scss';
import { TOOLTIP_NAME } from '../component-names';

export enum MTooltipMode {
    ICON = 'icon',
    LINK = 'link'
}

@WithRender
@Component
export class MTooltip extends Vue {
    @Prop({ default: MTooltipMode.ICON })
    public mode: string;
    @Prop()
    public label: string;
    @Prop({ default: true })
    public closeButton: boolean;

    public componentName = TOOLTIP_NAME;
    private propLabel: string;

    private get propMode(): string {
        return this.mode != MTooltipMode.ICON && this.label != undefined ? MTooltipMode.LINK : MTooltipMode.ICON;
    }

    private openTooltip(): void {
        console.log('test');
        this.$emit('click');
    }

    private onOpen(): void {
        this.openTooltip();
        this.$emit('open');
    }

    private onClose(): void {
        this.$emit('close', event);
    }

    private close(): void {
        this.$children[0]['closePopper']();
    }

}

const TooltipPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TOOLTIP_NAME, MTooltip);
    }
};

export default TooltipPlugin;
