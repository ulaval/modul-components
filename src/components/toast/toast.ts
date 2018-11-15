import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { TOAST } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import WithRender from './toast.html?style=./toast.scss';
import { ModulVue } from '../../utils/vue/vue';
import { PortalMixinImpl, BackdropMode, Portal, PortalMixin } from '../../mixins/portal/portal';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import ModulPlugin from '../../utils/modul/modul';
import PortalPlugin from 'portal-vue';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';

export enum MToastState {
    Confirmation = 'confirmation',
    Information = 'information',
    Warning = 'warning',
    Error = 'error'
}

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
    mixins: [ MediaQueries, Portal]
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

    @Prop({
        default: false
    })
    public isSameLine: boolean;

    public $refs: {
        toast: HTMLElement
    };

    public doCustomPropOpen(value: boolean, el: HTMLElement): boolean {
        if (value) {
            if (this.offset !== '0') {
                this.getPortalElement().style.transform = `translateY(${ this.offset })`;
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

    private onAction($event): void {
        this.$emit('action-button', $event);
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
