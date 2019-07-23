import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import I18nFilterPlugin from '../../filters/i18n/i18n';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import { TOAST } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import LinkPlugin, { MLinkMode } from '../link/link';
import WithRender from './toast.html?style=./toast.scss';

export enum MToastTimeout {
    none = 'none',
    xshort = 'xshort',
    short = 'short',
    long = 'long'
}

export enum MToastPosition {
    TopLeft = 'top-left',
    TopCenter = 'top-center',
    TopRight = 'top-right',
    BottomLeft = 'bottom-left',
    BottomCenter = 'bottom-center',
    BottomRight = 'bottom-right'
}

export enum MToastState {
    Confirmation = 'confirmation',
    Information = 'information',
    Warning = 'warning',
    Error = 'error'
}

export enum MToastDuration {
    MobileLong = 5000,
    MobileShort = 3000,
    MobileXShort = 1500,
    DesktopLong = 8000,
    DesktopShort = 5000,
    DesktopXShort = 2500,
    None = 0
}

@WithRender
@Component({
    mixins: [MediaQueries, Portal]
})
export class MToast extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MToastState.Confirmation,
        validator: value =>
            value === MToastState.Confirmation ||
            value === MToastState.Information ||
            value === MToastState.Warning ||
            value === MToastState.Error
    })
    public state: MToastState;

    @Prop({
        default: MToastPosition.BottomRight,
        validator: value =>
            value === MToastPosition.TopRight ||
            value === MToastPosition.TopCenter ||
            value === MToastPosition.TopLeft ||
            value === MToastPosition.BottomLeft ||
            value === MToastPosition.BottomCenter ||
            value === MToastPosition.BottomRight
    })
    public position: MToastPosition;

    @Prop({
        default: MToastTimeout.none,
        validator: value =>
            value === MToastTimeout.none ||
            value === MToastTimeout.xshort ||
            value === MToastTimeout.short ||
            value === MToastTimeout.long
    })
    public timeout: MToastTimeout;

    @Prop()
    public open: boolean;

    @Prop()
    public actionLabel: string;

    @Prop({
        default: true
    })
    public icon: boolean;

    @Prop({
        default: '0'
    })
    public offset: string;

    public $refs: {
        toast: HTMLElement
    };

    private buttonMode: MLinkMode = MLinkMode.Button;
    private timerCloseToast: any;
    private internalTimeout: number;
    private instantTimeoutStart: number;

    public doCustomPropOpen(value: boolean, el: HTMLElement): boolean {
        el.style.position = 'absolute';
        if (value) {
            if (this.offset !== '0') {
                this.getPortalElement().style.transform = `translateY(${this.offset})`;
            }

            this.internalTimeout = this.convertTimeout(this.timeout);
            this.startCloseToast();
        }
        return true;
    }

    private startCloseToast(): void {
        this.instantTimeoutStart = Date.now();

        if (this.internalTimeout > 0) {
            this.timerCloseToast
                = setTimeout(() => {
                    this.onClose();
                }, this.internalTimeout);
        }
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.toast;
    }

    public getBackdropMode(): BackdropMode {
        return BackdropMode.None;
    }

    public handlesFocus(): boolean {
        return false;
    }

    protected mounted(): void {
        if (this.open === undefined || this.open === true) {
            this.as<PortalMixin>().propOpen = true;
        }
    }

    private convertTimeout(timeout: MToastTimeout): number {
        switch (timeout) {
            case MToastTimeout.long:
                return this.isMobile ? MToastDuration.MobileLong : MToastDuration.DesktopLong;
            case MToastTimeout.short:
                return this.isMobile ? MToastDuration.MobileShort : MToastDuration.DesktopShort;
            case MToastTimeout.xshort:
                return this.isMobile ? MToastDuration.MobileXShort : MToastDuration.DesktopXShort;
            case MToastTimeout.none:
            default:
                return MToastDuration.None;
        }
    }

    @Emit('action-button')
    private onAction(event: Event): void {
        this.onClose();
    }

    private onClose(): void {
        this.as<PortalMixin>().propOpen = false;
    }

    private get isStateInformation(): boolean {
        return this.state === MToastState.Information;
    }

    private get isStateWarning(): boolean {
        return this.state === MToastState.Warning;
    }

    private get isStateError(): boolean {
        return this.state === MToastState.Error;
    }

    private get isStateConfirmation(): boolean {
        return this.state === MToastState.Confirmation;
    }

    public get isTop(): boolean {
        return this.position === MToastPosition.TopLeft ||
            this.position === MToastPosition.TopCenter ||
            this.position === MToastPosition.TopRight;
    }

    private get isLeft(): boolean {
        return this.position === MToastPosition.TopLeft ||
            this.position === MToastPosition.BottomLeft;
    }

    private get isCenter(): boolean {
        return this.position === MToastPosition.TopCenter ||
            this.position === MToastPosition.BottomCenter;
    }

    private get isRight(): boolean {
        return this.position === MToastPosition.TopRight ||
            this.position === MToastPosition.BottomRight;
    }

    private get isMobile(): boolean {
        return this.as<MediaQueriesMixin>().isMqMaxS;
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MToastState.Confirmation:
                icon = 'm-svg__confirmation';
                break;
            case MToastState.Information:
                icon = 'm-svg__information';
                break;
            case MToastState.Warning:
                icon = 'm-svg__warning';
                break;
            case MToastState.Error:
                icon = 'm-svg__error';
                break;
            default:
                break;
        }
        return icon;
    }

    public mouseEnterToast(): void {
        if (!this.isMobile && this.timerCloseToast !== undefined) {
            this.restoreTimeout();
            clearTimeout(this.timerCloseToast);
            this.timerCloseToast = undefined;
        }
    }

    private restoreTimeout(): void {
        let instantTimeoutStop: number = Date.now();
        this.internalTimeout -= (instantTimeoutStop - this.instantTimeoutStart);
    }

    public mouseLeaveToast(): void {
        if (!this.isMobile) {
            this.startCloseToast();
        }
    }

}

const ToastPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nFilterPlugin);
        v.use(IconPlugin);
        v.use(LinkPlugin);
        v.use(IconButtonPlugin);
        v.use(I18nPlugin);
        v.use(MediaQueriesPlugin);
        v.component(TOAST, MToast);
    }
};

export default ToastPlugin;
