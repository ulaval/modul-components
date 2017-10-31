import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import WithRender from './sidebar-window.html?style=../../mixins/base-window/base-window.scss';

export enum MSidebarOrigin {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
    BottomRight = 'bottom-right',
    BottomLeft = 'bottom-left'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MSidebar extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MSidebarOrigin.Bottom,
        validator: value =>
            value == MSidebarOrigin.Top ||
            value == MSidebarOrigin.Right ||
            value == MSidebarOrigin.Left ||
            value == MSidebarOrigin.Bottom ||
            value == MSidebarOrigin.BottomRight ||
            value == MSidebarOrigin.BottomLeft
    })
    public origin: MSidebarOrigin;

    @Prop()
    public width: string;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop({ default: true })
    public closeOnBackdrop: boolean;

    public get popupBody(): any {
        return (this.$refs.article as Element).querySelector('.m-popup__body');
    }

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public hasBackdrop(): boolean {
        return true;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasHeaderSlot(): boolean {
        // todo: header or title?
        return !!this.$slots.header;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private backdropClick(): void {
        if (this.closeOnBackdrop) {
            this.as<PortalMixin>().tryClose();
        }
    }

    private closeDialog(): void {
        this.as<PortalMixin>().tryClose();
    }

    private get marginLeft(): string {
        return this.origin == MSidebarOrigin.Right || this.origin == MSidebarOrigin.BottomRight ? 'calc(100% - ' + this.propWidth + ')' : '';
    }

    private get propWidth(): string {
        if (!this.width) {
            if (this.origin == MSidebarOrigin.Top || this.origin == MSidebarOrigin.Bottom) {
                return '100%';
            } else {
                return '50%';
            }
        } else {
            return this.width;
        }
    }
}

const SidebarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
