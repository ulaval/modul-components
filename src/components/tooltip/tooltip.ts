import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { TOOLTIP_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import uuid from '../../utils/uuid/uuid';
import LinkPlugin from '../link/link';
import { MPopperPlacement } from '../popper/popper';
import WithRender from './tooltip.html?style=./tooltip.scss';

export enum MTooltipMode {
    Icon = 'icon',
    Link = 'link'
}

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MTooltip extends ModulVue {
    @Prop()
    public open: boolean;
    @Prop({
        default: MTooltipMode.Icon,
        validator: value =>
            value === MTooltipMode.Icon ||
            value === MTooltipMode.Link
    })
    public mode: string;
    @Prop({
        default: MPopperPlacement.Bottom,
        validator: value =>
            value === MPopperPlacement.Bottom ||
            value === MPopperPlacement.BottomEnd ||
            value === MPopperPlacement.BottomStart ||
            value === MPopperPlacement.Left ||
            value === MPopperPlacement.LeftEnd ||
            value === MPopperPlacement.LeftStart ||
            value === MPopperPlacement.Right ||
            value === MPopperPlacement.RightEnd ||
            value === MPopperPlacement.RightStart ||
            value === MPopperPlacement.Top ||
            value === MPopperPlacement.TopEnd ||
            value === MPopperPlacement.TopStart
    })
    public placement: MPopperPlacement;
    @Prop({ default: true })
    public closeButton: boolean;
    @Prop()
    public disabled: boolean;
    @Prop()
    public openTitle: string;
    @Prop()
    public closeTitle: string;
    @Prop({ default: true })
    public underline: boolean;
    @Prop()
    public className: string;

    private propOpen: boolean = false;
    private id: string = `mTooltip-${uuid.generate()}`;

    protected mounted(): void {
        this.propOpen = this.open;
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private get propMode(): string {
        return this.mode === MTooltipMode.Link ? this.mode : MTooltipMode.Icon;
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

    private onClick(): void {
        this.$emit('click');
    }

    private getOpenTitle(): string {
        return this.openTitle === undefined ? this.$i18n.translate('m-tooltip:open') : this.openTitle;
    }

    private getCloseTitle(): string {
        return this.closeTitle === undefined ? this.$i18n.translate('m-tooltip:close') : this.closeTitle;
    }

    private get propTitle(): string {
        return this.propOpen ? this.getCloseTitle() : this.getOpenTitle();
    }

    private close(): void {
        this.propOpen = false;
    }

    private get ariaControls(): string {
        return this.id + '-controls';
    }
}

const TooltipPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(TOOLTIP_NAME + ' is not ready for production');
        v.use(ButtonPlugin);
        v.use(LinkPlugin);
        v.use(I18nPlugin);
        v.use(MediaQueriesPlugin);
        v.component(TOOLTIP_NAME, MTooltip);
    }
};

export default TooltipPlugin;
