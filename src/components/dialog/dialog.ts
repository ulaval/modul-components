import PortalPlugin from 'portal-vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { BackdropMode, Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { DIALOG_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './dialog.html?style=./dialog.scss';

export enum MDialogWidth {
    Default = 'default',
    Large = 'large'
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
    @Prop({
        default: MDialogWidth.Default,
        validator: value =>
            value === MDialogWidth.Default ||
            value === MDialogWidth.Large
    })
    public width: string;

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
}

const DialogPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(PortalPlugin);
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
