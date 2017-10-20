import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { OpenTrigger, OpenTriggerMixinImpl, OpenTriggerMixin } from '../../mixins/open-trigger/open-trigger';
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

export const TRANSITION_DURATION: number = 300;
export const TRANSITION_DURATION_LONG: number = 600;

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

    @Prop({ default: 'mSidebar' })
    public id: string;

    @Prop()
    public width: string;

    @Prop({ default: false })
    public open: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

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
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('id', this.propId);
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
        return (this.$refs.article as Element).querySelector('.m-popup__body');
    }

    public get propOpen(): boolean {
        return this.open && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value) {
            if (this.portalTargetEl) {
                this.portalTargetEl.style.zIndex = String(this.$modul.windowZIndex);
                this.portalTargetEl.style.position = 'absolute';

                setTimeout(() => {
                    this.setFastFocusToElement(this.$refs.article as HTMLElement);
                }, TRANSITION_DURATION_LONG);
            }

            if (value != this.internalOpen) {
                this.$emit('open');
            }
        } else {
            if (this.portalTargetEl) {
                setTimeout(() => {
                    this.portalTargetEl.style.position = '';

                    let trigger: HTMLElement | undefined = this.as<OpenTriggerMixin>().getTrigger();
                    if (trigger) {
                        this.setFastFocusToElement(trigger);
                    }
                }, TRANSITION_DURATION);
            }
            if (value != this.internalOpen) {
                // really closing, reset focus
                this.$emit('close');
            }
        }
        this.internalOpen = value;
        this.$emit('update:open', value);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private setFastFocusToElement(el: HTMLElement): void {
        if (this.focusManagement) {
            el.setAttribute('tabindex', '0');
            el.focus();
            el.blur();
            el.removeAttribute('tabindex');
        }
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
        this.propOpen = false;
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
