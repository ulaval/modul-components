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

// const TRANSITION_DURATION: number = 300;
// const TRANSITION_DURATION_LONG: number = 600;

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

    // @Prop({ default: 'mSidebar' })
    // public id: string;

    @Prop()
    public width: string;

    // @Prop()
    // public open: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop()
    public closeOnBackdrop: boolean;

    // @Prop({ default: false })
    // public disabled: boolean;

    // private portalTargetEl: HTMLElement;
    // private internalOpen: boolean = false;
    // private propId: string = '';

    // public getPortalTargetElement(): HTMLElement {
    //     return this.portalTargetEl;
    // }

    // protected beforeMount(): void {
    //     this.propId = this.id + '-' + uuid.generate();
    //     let element: HTMLElement = document.createElement('div');
    //     element.setAttribute('id', this.propId);
    //     document.body.appendChild(element);
    // }

    // protected mounted(): void {
    //     this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
    // }

    // protected beforeDestroy(): void {
    //     document.body.removeChild(this.portalTargetEl);
    // }

    public get popupBody(): any {
        return (this.$refs.article as Element).querySelector('.m-popup__body');
    }

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public doCustomPropOpen(value: boolean): void {
        // nothing
    }

    public hasBackdrop(): boolean {
        return true;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    // public get propOpen(): boolean {
    //     return (this.open === undefined ? this.internalOpen : this.open) && !this.disabled;
    // }

    // public set propOpen(value: boolean) {
    //     if (value != this.internalOpen) {
    //         if (value) {
    //             if (this.portalTargetEl) {
    //                 this.$modul.pushElement(this.portalTargetEl);
    //                 this.portalTargetEl.style.position = 'absolute';

    //                 setTimeout(() => {
    //                     this.setFastFocusToElement(this.$refs.article as HTMLElement);
    //                 }, TRANSITION_DURATION_LONG);
    //             }

    //             if (value != this.internalOpen) {
    //                 this.$emit('open');
    //             }
    //         } else {
    //             if (this.portalTargetEl) {
    //                 this.$modul.popElement(this.portalTargetEl);

    //                 setTimeout(() => {
    //                     // $emit update:open has been launched, animation already occurs

    //                     this.portalTargetEl.style.position = '';
    //                     let trigger: HTMLElement | undefined = this.as<OpenTriggerHookMixin>().triggerHook;
    //                     if (trigger) {
    //                         this.setFastFocusToElement(trigger);
    //                     }
    //                 }, TRANSITION_DURATION);
    //             }
    //             if (value != this.internalOpen) {
    //                 // really closing, reset focus
    //                 this.$emit('close');
    //             }
    //         }
    //     }
    //     this.internalOpen = value;
    //     this.$emit('update:open', value);
    // }

    // @Watch('open')
    // private openChanged(open: boolean): void {
    //     this.propOpen = open;
    // }

    // private setFastFocusToElement(el: HTMLElement): void {
    //     if (this.focusManagement) {
    //         el.setAttribute('tabindex', '0');
    //         el.focus();
    //         el.blur();
    //         el.removeAttribute('tabindex');
    //     }
    // }

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
