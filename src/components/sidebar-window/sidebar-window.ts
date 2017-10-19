import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { OpenTrigger, OpenTriggerMixin } from '../../mixins/open-trigger/open-trigger';
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
export class MSidebar extends ModulVue implements OpenTriggerMixin {
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

    @Prop({ default: 'mSidebar' })
    public id: string;

    @Prop()
    public width: string;

    @Prop({ default: false })
    public open: boolean;

    @Prop({ default: false })
    public disabled: boolean;

    private portalTargetEl: HTMLElement;
    private internalOpen: boolean = false;
    private propId: string;

    public getPortalTargetElement(): HTMLElement {
        return this.portalTargetEl;
    }

    protected beforeMount(): void {
        this.propId = this.id + '-' + uuid.generate();
        let element: HTMLElement = document.createElement('div') as HTMLElement;
        element.setAttribute('id', this.propId);
        // element.setAttribute('class', this.classNamePortalTarget);
        document.body.appendChild(element);
    }

    protected mounted(): void {
        this.propOpen = this.open;
        this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
    }

    protected beforeDestroy(): void {
        document.body.removeChild(this.portalTargetEl);
    }

    public get popupBody(): any {
        // return (this.$refs.popper as Element).querySelector('.m-popup__body');
        throw Error('Not implemented exception');
    }

    public get propOpen(): boolean {
        return this.open && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value) {
            this.portalTargetEl.style.zIndex = String(this.$modul.windowZIndex);

            if (value != this.internalOpen) {
                this.$emit('open');
            }
        } else {
            if (value != this.internalOpen) {
                // really closing, reset focus
                this.setFastFocusToElement(this.$el);
                this.$emit('close');
            }
        }
        this.internalOpen = value;
        this.$emit('update:open', value);
    }

    private setFastFocusToElement(el: HTMLElement): void {
        // if (this.focusManagement) {
        //     el.setAttribute('tabindex', '0');
        //     el.focus();
        //     el.blur();
        //     el.removeAttribute('tabindex');
        // }
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private backdropClick(): void {

    }

    private closeDialog(): void {

    }

    // protected get windowMode(): BaseWindowMode {
    //     return BaseWindowMode.Sidebar;
    // }

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
