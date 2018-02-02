import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { FULLPAGE_NAME } from '../component-names';
import { Portal, PortalMixin, PortalMixinImpl, BackdropMode, PortalTransitionDuration } from '../../mixins/portal/portal';
import WithRender from './fullpage.html?style=./fullpage.scss';
import { log } from 'util';

export enum MSidebarOrigin {
    Bottom = 'bottom'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MFullpage extends ModulVue {

    @Prop({
        default: MSidebarOrigin.Bottom,
        validator: value =>
            value == MSidebarOrigin.Bottom
    })
    public origin: MSidebarOrigin;

    @Prop({ default: true })
    public center: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    protected mounted() {
        this.as<Portal>().transitionDuration = PortalTransitionDuration.Slow;
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

    private menageScroll(): boolean {
        return true;
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
}

const FullpagePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(FULLPAGE_NAME, MFullpage);
    }
};

export default FullpagePlugin;
