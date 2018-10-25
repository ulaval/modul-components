import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { BackdropMode, Portal, PortalMixin, PortalTransitionDuration } from '../../mixins/portal/portal';
import { ModulVue } from '../../utils/vue/vue';
import { OVERLAY_NAME } from '../component-names';
import WithRender from './overlay.html?style=./overlay.scss';
import UserAgentUtil from '../../utils/user-agent/user-agent';

@WithRender
@Component({
    mixins: [Portal]
})
export class MOverlay extends ModulVue {

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;
    @Prop({ default: false })
    public disableSaveButton: boolean;

    public hasKeyboard: boolean = false;
    public isOverflowing: boolean = false;

    public $refs: {
        dialogWrap: HTMLElement,
        body: HTMLElement,
        footer: HTMLElement,
        article: Element
    };

    protected mounted(): void {
        this.as<Portal>().transitionDuration = PortalTransitionDuration.Regular + PortalTransitionDuration.XSlow;
    }

    private get popupBody(): any {
        return (this.$refs.article as Element).querySelector('.m-popup__body');
    }

    private get isAndroid(): boolean {
        return UserAgentUtil.isAndroid();
    }

    private onFocusIn(): void {
        if (this.isAndroid) {
            if (this.$refs.body.scrollHeight < this.$refs.article.clientHeight) {
                this.isOverflowing = true;
                let footerHeight: number = this.$refs.footer.clientHeight;
                this.$refs.body.style.paddingBottom = `calc(100% - ${footerHeight}px)`;
            }
            this.hasKeyboard = true;
        }
    }

    private onFocusOut(): void {
        if (this.isAndroid) {
            if (this.isOverflowing) {
                this.isOverflowing = false;
                this.$refs.body.style.paddingBottom = '0';
            }
            this.hasKeyboard = false;
        }
    }

    private handlesFocus(): boolean {
        return this.focusManagement;
    }

    private doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    private getBackdropMode(): BackdropMode {
        return BackdropMode.ScrollOnly;
    }

    private getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    private get hasHeaderRightSlot(): boolean {
        return !!this.$slots['header-right'];
    }

    private get isSaveButtonDisabled(): boolean {
        return this.disableSaveButton;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private save(e: MouseEvent): void {
        this.$emit('save', e);
    }

    private cancel(e: MouseEvent): void {
        this.$emit('cancel', e);
        this.close();
    }

    private close(): void {
        this.as<PortalMixin>().tryClose();
    }
}

const OverlayPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(OVERLAY_NAME, MOverlay);
    }
};

export default OverlayPlugin;
