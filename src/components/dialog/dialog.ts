import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { DIALOG_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import IconPlugin from '../icon/icon';
import WithRender from './dialog.html?style=./dialog.scss';

export enum MDialogWidth {
    Default = 'default',
    Large = 'large'
}

export enum MDialogState {
    Default = 'default',
    Warning = 'warning',
    Confirmation = 'confirmation',
    Information = 'information',
    Error = 'error'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MDialog extends ModulVue implements PortalMixinImpl {
    @Prop()
    public title: string;
    @Prop()
    public message: string;
    @Prop()
    public okLabel: string | undefined;
    @Prop()
    public okPrecision: string | undefined;
    @Prop()
    public cancelLabel: string | undefined;
    @Prop({ default: true })
    public negativeLink: boolean;
    @Prop()
    public hint: string;
    @Prop({
        default: MDialogWidth.Default,
        validator: value =>
            value === MDialogWidth.Default ||
            value === MDialogWidth.Large
    })
    public width: string;

    @Prop({
        default: MDialogState.Default,
        validator: value =>
            value === MDialogState.Default ||
            value === MDialogState.Warning ||
            value === MDialogState.Confirmation ||
            value === MDialogState.Information ||
            value === MDialogState.Error
    })
    public type: MDialogState;

    public handlesFocus(): boolean {
        return true;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public getBackdropMode(): BackdropMode {
        return BackdropMode.BackdropFast;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    private onOk(): void {
        this.as<PortalMixin>().propOpen = false;
        this.$emit('ok');
    }

    private onCancel(): void {
        this.as<PortalMixin>().propOpen = false;
        this.$emit('cancel');
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get hasHint(): boolean {
        return !!this.hint;
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasMessage(): boolean {
        return !!this.message;
    }

    private get hasOkLabel(): boolean {
        return !!this.okLabel;
    }

    private get hasOkPrecision(): boolean {
        return !!this.okPrecision;
    }

    private get hasCancelLabel(): boolean {
        return !!this.cancelLabel;
    }

    private get hasWidthLarge(): boolean {
        return this.width === MDialogWidth.Large;
    }

    private get getState(): string {
        let state: string = '';
        switch (this.type) {
            case MDialogState.Confirmation:
                state = 'confirmation';
                break;
            case MDialogState.Information:
                state = 'information';
                break;
            case MDialogState.Warning:
                state = 'warning';
                break;
            case MDialogState.Error:
                state = 'error';
                break;
            default:
                break;
        }
        return state;
    }

}

const DialogPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
