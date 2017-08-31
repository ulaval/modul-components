import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './tooltip.html?style=./tooltip.scss';
import { TOOLTIP_NAME } from '../component-names';
import { MPopup } from '../popup/popup';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { MPopperPlacement } from '../popper/popper';

export enum MTooltipMode {
    Icon = 'icon',
    Link = 'link'
}

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MTooltip extends ModulVue {
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: MTooltipMode.Icon })
    public mode: string;
    @Prop({ default: MPopperPlacement.Bottom })
    public placement: MPopperPlacement;
    @Prop({ default: true })
    public closeButton: boolean;
    @Prop({ default: '' })
    public classNamePortalTarget: string;
    @Prop({ default: false })
    public disabled: boolean;

    public componentName = TOOLTIP_NAME;
    private propOpen: boolean;
    private error: boolean = false;
    private isEqMaxS: boolean = false;

    protected mounted(): void {
        this.propOpen = this.open;
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private get propMode(): string {
        return this.mode == MTooltipMode.Link ? this.mode : MTooltipMode.Icon;
    }

    private get propCloseButton(): boolean {
        return this.as<MediaQueriesMixin>().isMqMaxS ? false : this.closeButton;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasBodySlot(): boolean {
        return !!this.$slots.body;
    }

    private onOpen(): void {
        this.$emit('open');
    }

    private onClose(): void {
        this.$emit('close', event);
    }

    private close(): void {
        (this.$children[0] as MPopup).propOpen = false;
    }
}

const TooltipPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TOOLTIP_NAME, MTooltip);
    }
};

export default TooltipPlugin;
