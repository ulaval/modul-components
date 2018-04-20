import { PluginObject } from 'vue';
import { Prop } from 'vue-property-decorator';
import PortalPlugin from 'portal-vue';
import Component from 'vue-class-component';
import WithRender from './modal.html?style=./modal.scss';
import { ModulVue } from '../../utils/vue/vue';
import { MODAL_NAME } from '../component-names';
import { Portal, PortalMixinImpl, PortalMixin, BackdropMode } from '../../mixins/portal/portal';
import ButtonPlugin from '../button/button';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';

@WithRender
@Component({
    mixins: [Portal]
})
export class MModal extends ModulVue implements PortalMixinImpl {
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
}

const ModalPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(PortalPlugin);
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
