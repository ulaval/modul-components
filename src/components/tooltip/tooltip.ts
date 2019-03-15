import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { TOOLTIP_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import LinkPlugin from '../link/link';
import { MPopperPlacement } from '../popper/popper';
import PopupPlugin from '../popup/popup';
import WithRender from './tooltip.html?style=./tooltip.scss';

export enum MTooltipMode {
    Icon = 'icon',
    Link = 'link',
    Definition = 'definition'
}

export enum MTooltipSize {
    Small = 'small',
    Large = 'large'
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
            value === MTooltipMode.Link ||
            value === MTooltipMode.Definition
    })
    public mode: MTooltipMode;
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
    @Prop()
    public className: string;
    @Prop({
        default: MTooltipSize.Small,
        validator: value =>
            value === MTooltipSize.Large ||
            value === MTooltipSize.Small
    })
    public size: MTooltipSize;

    public id: string = `mTooltip-${uuid.generate()}`;
    public ariaControls: string = this.id + '-controls';

    private propOpen: boolean = false;

    protected mounted(): void {
        this.propOpen = this.open;
    }

    @Emit('close')
    public onClick(event: Event): void {
    }

    public get isModeIcon(): boolean {
        return this.mode === MTooltipMode.Icon;
    }

    public get isModeLink(): boolean {
        return this.mode === MTooltipMode.Link;
    }

    public get isModeDefinition(): boolean {
        return this.mode === MTooltipMode.Definition;
    }

    public get isSizeLarge(): boolean {
        return this.size === MTooltipSize.Large;
    }

    public get hasCloseButton(): boolean {
        return this.as<MediaQueriesMixin>().isMqMaxS ? false : this.closeButton;
    }

    public get title(): string {
        return this.propOpen ? this.CloseTitle : this.OpenTitle;
    }

    public get OpenTitle(): string {
        return this.openTitle === undefined ? this.$i18n.translate('m-tooltip:open') : this.openTitle;
    }

    public get CloseTitle(): string {
        return this.closeTitle === undefined ? this.$i18n.translate('m-tooltip:close') : this.closeTitle;
    }

    public close(): void {
        this.propOpen = false;
    }

    public get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    @Emit('open')
    private onOpen(): void {
    }

    @Emit('close')
    private onClose(): void {
    }
}

const TooltipPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PopupPlugin);
        v.use(IconPlugin);
        v.use(IconButtonPlugin);
        v.use(LinkPlugin);
        v.use(I18nPlugin);
        v.use(MediaQueriesPlugin);
        v.component(TOOLTIP_NAME, MTooltip);
    }
};

export default TooltipPlugin;
