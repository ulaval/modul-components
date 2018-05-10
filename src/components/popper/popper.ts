import Popper from 'popper.js';
import PortalPlugin from 'portal-vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { BackdropMode, Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import ModulPlugin from '../../utils/modul/modul';
import { ModulVue } from '../../utils/vue/vue';
import { POPPER_NAME } from '../component-names';
import WithRender from './popper.html?style=./popper.scss';

export enum MPopperPlacement {
    Top = 'top',
    TopStart = 'top-start',
    TopEnd = 'top-end',
    Right = 'right',
    RightStart = 'right-start',
    RightEnd = 'right-end',
    Bottom = 'bottom',
    BottomStart = 'bottom-start',
    BottomEnd = 'bottom-end',
    Left = 'left',
    LeftStart = 'left-start',
    LeftEnd = 'left-end'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MPopper extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MPopperPlacement.Bottom,
        validator: value =>
            value == MPopperPlacement.Bottom ||
            value == MPopperPlacement.BottomEnd ||
            value == MPopperPlacement.BottomStart ||
            value == MPopperPlacement.Left ||
            value == MPopperPlacement.LeftEnd ||
            value == MPopperPlacement.LeftStart ||
            value == MPopperPlacement.Right ||
            value == MPopperPlacement.RightEnd ||
            value == MPopperPlacement.RightStart ||
            value == MPopperPlacement.Top ||
            value == MPopperPlacement.TopEnd ||
            value == MPopperPlacement.TopStart
    })
    public placement: MPopperPlacement;

    @Prop({ default: true })
    public closeOnClickOutside: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop({ default: true })
    public shadow: boolean;

    @Prop()
    public beforeEnter: any;

    @Prop()
    public enter: any;

    @Prop()
    public afterEnter: any;

    @Prop()
    public enterCancelled: any;

    @Prop()
    public beforeLeave: any;

    @Prop()
    public leave: any;

    @Prop()
    public afterLeave: any;

    @Prop()
    public leaveCancelled: any;

    private popper: Popper | undefined;
    private defaultAnimOpen: boolean = false;
    private internalOpen: boolean = false;

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public getBackdropMode(): BackdropMode {
        return BackdropMode.None;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.popper as HTMLElement;
    }

    public doCustomPropOpen(value: boolean, el: HTMLElement): boolean {
        if (value) {
            if (this.popper == undefined) {
                let options: object = {
                    placement: this.placement,
                    eventsEnabled: false
                };
                let reference: Element = this.as<PortalMixin>().getTrigger() as Element;
                if (!reference) {
                    reference = document.getElementsByTagName('body')[0];
                }
                this.popper = new Popper(reference, el, options);
            } else {
                this.popper.update();
            }
        }
        return true;
    }

    public update(): void {
        if (this.popper !== undefined) {
            this.popper.update();
        }
    }

    protected mounted(): void {
        this.$modul.event.$on('scroll', this.update);
        this.$modul.event.$on('resize', this.update);
        this.$modul.event.$on('updateAfterResize', this.update);

        // sometimes, the document.click event is stopped causing a menu to stay open, even if another menu has been clicked.
        // mouseup will always be caught even if click is stopped.
        document.addEventListener('mouseup', this.onDocumentClick);
    }

    protected beforeDestroy(): void {
        this.$modul.event.$off('scroll', this.update);
        this.$modul.event.$off('resize', this.update);
        this.$modul.event.$off('updateAfterResize', this.update);
        document.removeEventListener('mouseup', this.onDocumentClick);

        this.destroyPopper();
    }

    public get popupBody(): any {
        return (this.$refs.popper as Element).querySelector('.m-popup__body');
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.as<PortalMixin>().propOpen) {
            let trigger: HTMLElement | undefined = this.as<PortalMixin>().getTrigger();
            if (!(this.as<PortalMixin>().getPortalElement().contains(event.target as Node) || this.$el.contains(event.target as HTMLElement) ||
                (trigger && trigger.contains(event.target as HTMLElement)))) {
                this.as<PortalMixin>().propOpen = false;
            }
        }
    }

    private destroyPopper(): void {
        if (this.popper !== undefined) {
            this.popper.destroy();
            this.popper = undefined;
        }
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get defaultAnim(): boolean {
        return !(this.beforeEnter || this.enter || this.afterEnter || this.beforeLeave || this.leave || this.afterLeave);
    }

    private onBeforeEnter(el: HTMLElement): void {
        if (this.beforeEnter) {
            this.beforeEnter(el.children[0]);
        }
    }

    private onEnter(el: HTMLElement, done): void {
        this.$nextTick(() => {
            this.update();
        });
        if (this.enter) {
            this.enter(el.children[0], done);
        } else {
            this.$nextTick(() => {
                this.defaultAnimOpen = true;
                done();
            });
        }
    }

    private onAfterEnter(el: HTMLElement): void {
        if (this.afterEnter) {
            this.afterEnter(el.children[0]);
        }

        this.as<PortalMixin>().setFocusToPortal();
    }

    private onEnterCancelled(el: HTMLElement): void {
        if (this.enterCancelled) {
            this.enterCancelled(el);
        }
    }

    private onBeforeLeave(el: HTMLElement): void {
        if (this.beforeLeave) {
            this.beforeLeave(el.children[0]);
        }
    }

    private onLeave(el: HTMLElement, done): void {
        if (this.leave) {
            this.leave(el.children[0], done);
        } else {
            this.defaultAnimOpen = false;
            setTimeout(() => {
                done();
            }, 300);
        }
    }

    private onAfterLeave(el: HTMLElement): void {
        if (this.afterLeave) {
            this.afterLeave(el.children[0]);
        }

        this.as<PortalMixin>().setFocusToTrigger();
    }

    private onLeaveCancelled(el: HTMLElement): void {
        if (this.leaveCancelled) {
            this.leaveCancelled(el.children[0]);
        }
    }
}

const PopperPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PortalPlugin);
        v.use(ModulPlugin);
        v.component(POPPER_NAME, MPopper);
    }
};

export default PopperPlugin;
