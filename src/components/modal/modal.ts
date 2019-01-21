import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl, PortalTransitionDuration } from '../../mixins/portal/portal';
import UserAgentUtil from '../../utils/user-agent/user-agent';
import { ModulVue } from '../../utils/vue/vue';
import { MODAL_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import WithRender from './modal.html?style=./modal.scss';

export enum MModalSize {
    FullScreen = 'full-screen',
    Large = 'large',
    Regular = 'regular',
    Small = 'small'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MModal extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MModalSize.Regular,
        validator: value =>
            value === MModalSize.Regular ||
            value === MModalSize.FullScreen ||
            value === MModalSize.Large ||
            value === MModalSize.Small
    })
    public size: MModalSize;

    @Prop({ default: true })
    public closeOnBackdrop: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop()
    public title: string;
    @Prop({ default: true })
    public bodyMaxWidth: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    public hasKeyboard: boolean = false;

    $refs: {
        body: HTMLElement;
        modalWrap: HTMLElement;
        article: HTMLElement;
    };

    private closeTitle: string = this.$i18n.translate('m-modal:close');

    public closeModal(): void {
        this.as<PortalMixin>().tryClose();
    }

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public getBackdropMode(): BackdropMode {
        return this.sizeFullSceen ? BackdropMode.ScrollOnly : BackdropMode.BackdropFast;
    }

    public get sizeFullSceen(): boolean {
        let fullScreen: boolean = !this.as<MediaQueriesMixin>().isMqMinS ? true : this.size === MModalSize.FullScreen ? true : false;
        this.as<Portal>().transitionDuration = fullScreen ? PortalTransitionDuration.XSlow : PortalTransitionDuration.Regular;
        return fullScreen;
    }

    public get sizeLarge(): boolean {
        return this.as<MediaQueriesMixin>().isMqMinS && this.size === MModalSize.Large;
    }

    public get sizeSmall(): boolean {
        return this.as<MediaQueriesMixin>().isMqMinS && this.size === MModalSize.Small;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article;
    }

    protected mounted(): void {
        if (!this.hasHeader) {
            this.$log.warn('<' + MODAL_NAME + '> needs a header slot or title prop.');
        }
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasHeader(): boolean {
        return this.hasTitle || !!this.$slots.header;
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private backdropClick(): void {
        if (this.closeOnBackdrop) {
            this.as<PortalMixin>().tryClose();
        }
    }

    private get isAndroid(): boolean {
        return UserAgentUtil.isAndroid();
    }

    private onFocusIn(): void {
        if (this.isAndroid) {
            this.hasKeyboard = true;
        }
    }

    private onFocusOut(): void {
        if (this.isAndroid) {
            this.hasKeyboard = false;
        }
    }
}

const ModalPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconButtonPlugin);
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
