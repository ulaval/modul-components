import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl, PortalTransitionDuration } from '../../mixins/portal/portal';
import { ModulVue } from '../../utils/vue/vue';
import { SIDEBAR_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import WithRender from './sidebar.html?style=./sidebar.scss';

export enum MSidebarOrigin {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left'
}
export enum MSidebarCloseButtonPosition {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MSidebar extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MSidebarOrigin.Bottom,
        validator: value =>
            value === MSidebarOrigin.Top ||
            value === MSidebarOrigin.Right ||
            value === MSidebarOrigin.Left ||
            value === MSidebarOrigin.Bottom
    })
    public origin: MSidebarOrigin;

    @Prop()
    public width: string;
    @Prop()
    public title: string;
    @Prop({ default: true })
    public closeButton: boolean;
    @Prop({
        default: MSidebarCloseButtonPosition.Right,
        validator: value =>
            value === MSidebarCloseButtonPosition.Right ||
            value === MSidebarCloseButtonPosition.Left
    })
    public closeButtonPosition: MSidebarCloseButtonPosition;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop({ default: true })
    public closeOnBackdrop: boolean;

    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    public $refs: {
        baseWindow: HTMLElement;
        article: HTMLElement;
        modalWrap: HTMLElement;
        body: HTMLElement;
    };

    public get popupBody(): HTMLElement {
        return this.$refs.article.querySelector('.m-popup__body') as HTMLElement;
    }

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public getBackdropMode(): BackdropMode {
        return BackdropMode.BackdropFast;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article;
    }

    protected mounted(): void {
        this.as<Portal>().transitionDuration = PortalTransitionDuration.Slow;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasHeader(): boolean {
        return this.hasHeaderSlot || this.hasTitle || (this.closeButton && this.origin !== MSidebarOrigin.Bottom);
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

    private closeModal(): void {
        this.as<PortalMixin>().tryClose();
    }

    private get marginLeft(): string {
        return this.origin === MSidebarOrigin.Right ? 'calc(100% - ' + this.propWidth + ')' : '';
    }

    private get propWidth(): string {

        if (this.origin === MSidebarOrigin.Left || this.origin === MSidebarOrigin.Right) {
            return this.width ? this.width : '50%';
        } else {
            return '100%';
        }

    }
}

const SidebarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconButtonPlugin);
        v.use(I18nPlugin);
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
