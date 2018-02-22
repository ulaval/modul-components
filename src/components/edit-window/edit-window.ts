import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { EDIT_WINDOW_NAME } from '../component-names';
import { Portal, PortalMixin, PortalMixinImpl, BackdropMode, PortalTransitionDuration } from '../../mixins/portal/portal';
import WithRender from './edit-window.html?style=./edit-window.scss';
import { log } from 'util';

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

    protected mounted(): void {
        this.as<Portal>().transitionDuration = PortalTransitionDuration.Regular + PortalTransitionDuration.XSlow;
    }

    public get popupBody(): any {
        return (this.$refs.article as Element).querySelector('.m-popup__body');
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
    install(v, options) {
        v.component(EDIT_WINDOW_NAME, MEditWindow);
    }
};

export default FullpagePlugin;
