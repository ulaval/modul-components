import PortalPlugin from 'portal-vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import ModulPlugin from '../../utils/modul/modul';
import { ModulVue } from '../../utils/vue/vue';
import { TOAST } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import { MLinkMode } from '../link/link';
import { MMessageState } from '../message/message';
import WithRender from './toast.html?style=./toast.scss';


export enum MToastPosition {
    TopLeft = 'top-left',
    TopCenter = 'top-center',
    TopRight = 'top-right',
    BottomLeft = 'bottom-left',
    BottomCenter = 'bottom-center',
    BottomRight = 'bottom-right'
}

@WithRender
@Component({
    mixins: [MediaQueries, Portal]
})
export class MToast extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MMessageState.Confirmation,
        validator: value =>
            value === MMessageState.Confirmation ||
            value === MMessageState.Information ||
            value === MMessageState.Warning ||
            value === MMessageState.Error
    })
    public state: MMessageState;

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
        default: 0
    })
    public timeout: number;

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

    public doCustomPropOpen(value: boolean, el: HTMLElement): boolean {
        if (value) {
            if (this.offset !== '0') {
                this.getPortalElement().style.transform = `translateY(${this.offset})`;
            }

            if (this.timeout) {
                setTimeout(() => {
                    this.onClose();
                }, this.timeout);
            }
        }
        return true;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.toast as HTMLElement;
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

    @Emit('action-button')
    private actionButton(event: Event): void {
    }

    private onAction($event): void {
        this.$emit('action-button', $event);
        this.onClose();
    }

    private onClose(): void {
        this.as<PortalMixin>().propOpen = false;
    }

    private get isStateInformation(): boolean {
        return this.state === MMessageState.Information;
    }

    private get isStateWarning(): boolean {
        return this.state === MMessageState.Warning;
    }

    private get isStateError(): boolean {
        return this.state === MMessageState.Error;
    }

    private get isStateConfirmation(): boolean {
        return this.state === MMessageState.Confirmation;
    }

    private get isTop(): boolean {
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

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MMessageState.Confirmation:
                icon = 'm-svg__confirmation';
                break;
            case MMessageState.Information:
                icon = 'm-svg__information';
                break;
            case MMessageState.Warning:
                icon = 'm-svg__warning';
                break;
            case MMessageState.Error:
                icon = 'm-svg__error';
                break;
            default:
                break;
        }
        return icon;
    }

}

const ToastPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TOAST, 'plugin.install');
        v.use(ModulPlugin);
        v.use(PortalPlugin);
        v.use(IconPlugin);
        v.use(IconButtonPlugin);
        v.use(I18nPlugin);
        v.use(MediaQueriesPlugin);
        v.component(TOAST, MToast);
    }
};

export default ToastPlugin;
