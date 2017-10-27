import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { OpenTrigger, OpenTriggerMixin, OpenTriggerMixinImpl } from '../../mixins/open-trigger/open-trigger';
import { OpenTriggerHookMixin } from '../../mixins/open-trigger/open-trigger-hook';
import WithRender from './sidebar-window.html?style=../../mixins/base-window/base-window.scss';
import uuid from '../../utils/uuid/uuid';

export enum SidebarOrigin {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
    BottomRight = 'bottom-right',
    BottomLeft = 'Bottom-left'
}

@WithRender
@Component({
    mixins: [OpenTrigger]
})
export class MSidebar extends ModulVue implements OpenTriggerMixinImpl {
    @Prop({
        default: SidebarOrigin.Bottom,
        validator: value =>
            value == SidebarOrigin.Top ||
            value == SidebarOrigin.Right ||
            value == SidebarOrigin.Left ||
            value == SidebarOrigin.Bottom ||
            value == SidebarOrigin.BottomRight ||
            value == SidebarOrigin.BottomLeft
    })
    public origin: SidebarOrigin;

    @Prop()
    public width: string;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop()
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
            this.as<OpenTriggerMixin>().propOpen = false;
        }
    }

    private closeDialog(): void {
        this.as<OpenTriggerMixin>().propOpen = false;
    }

    // private get marginLeft(): string {
    //     return this.from == BaseWindowFrom.Right || this.from == BaseWindowFrom.BottomRight ? 'calc(100% - ' + this.propWidth + ')' : '';
    // }

    // private get propWidth(): string {
    //     if (this.width == undefined || this.width == '') {
    //         if (this.from == BaseWindowFrom.Top || this.from == BaseWindowFrom.Bottom) {
    //             return '100%';
    //         } else {
    //             return '50%';
    //         }
    //     } else {
    //         return this.width;
    //     }
    // }
}

const SidebarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
