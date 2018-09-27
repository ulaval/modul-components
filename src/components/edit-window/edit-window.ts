import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { BackdropMode, Portal, PortalMixin, PortalTransitionDuration } from '../../mixins/portal/portal';
import { ModulVue } from '../../utils/vue/vue';
import { EDIT_WINDOW_NAME } from '../component-names';
import WithRender from './edit-window.html?style=./edit-window.scss';

@WithRender
@Component({
    mixins: [Portal]
})
export class MEditWindow extends ModulVue {

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

    public $refs: {
        dialogWrap: HTMLElement,
        header: HTMLElement,
        body: HTMLElement,
        footer: HTMLElement,
        article: Element
    };

    protected mounted(): void {
        this.as<Portal>().transitionDuration = PortalTransitionDuration.Regular + PortalTransitionDuration.XSlow;

        if (this.isAndroid) {
            this.$on('open', this.stickFooter);
        }
    }

    public get popupBody(): any {
        return (this.$refs.article as Element).querySelector('.m-popup__body');
    }

    public get isAndroid(): boolean {
        return /(android)/i.test(window.navigator.userAgent);
    }

    // to stick the footer at the window bottom and not have the footer get pushed by android keyboard
    private stickFooter(): void {

        // waiting until the opening animation has finished before doing anything DOM related
        setTimeout(() => {
            let wrapH: number = this.$refs.dialogWrap.clientHeight;
            let headerH: number = this.$refs.header.clientHeight;
            let footerH: number = this.$refs.footer.clientHeight;

            this.$refs.body.style.height = wrapH - (headerH + footerH) + 'px';

        }, this.as<Portal>().transitionDuration);

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

const FullpagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(EDIT_WINDOW_NAME, MEditWindow);
    }
};

export default FullpagePlugin;
