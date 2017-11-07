import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './tooltip.html?style=./tooltip.scss';
import { TOOLTIP_NAME } from '../component-names';
import { MPopup } from '../popup/popup';
import { MPopper } from '../popper/popper';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { MPopperPlacement } from '../popper/popper';
import ButtonPlugin from '../button/button';
import LinkPlugin from '../link/link';
import I18nPlugin from '../i18n/i18n';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';

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
    @Prop()
    public openTitle: string;
    @Prop()
    public closeTitle: string;

    private propOpen = false;

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

    private onOpen(): void {
        this.$emit('open');
    }

    private onClose(): void {
        this.$emit('close', event);
    }

    private get propOpenTitle(): string {
        return this.openTitle == undefined ? this.$i18n.translate('m-tooltip:open') : this.openTitle;
    }

    private get propcloseTitle(): string {
        return this.closeTitle == undefined ? this.$i18n.translate('m-tooltip:close') : this.closeTitle;
    }

    private close(): void {
        this.propOpen = false;
    }
}

const TooltipPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(ButtonPlugin);
        v.use(LinkPlugin);
        v.use(I18nPlugin);
        v.use(MediaQueriesPlugin);
        v.component(TOOLTIP_NAME, MTooltip);
    }
};

export default TooltipPlugin;
