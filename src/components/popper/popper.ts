import Popper from 'popper.js';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
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
            value === MPopperPlacement.Bottom ||
            value === MPopperPlacement.BottomEnd ||
            value === MPopperPlacement.BottomStart ||
            value === MPopperPlacement.Left ||
            value === MPopperPlacement.LeftEnd ||
            value === MPopperPlacement.LeftStart ||
            value === MPopperPlacement.Right ||
            value === MPopperPlacement.RightEnd ||
            value === MPopperPlacement.RightStart ||
            value === MPopperPlacement.Top ||
            value === MPopperPlacement.TopEnd ||
            value === MPopperPlacement.TopStart
    })
    public placement: MPopperPlacement;

    @Prop({ default: true })
    public closeOnClickOutside: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop({ default: true })
    public shadow: boolean;
    @Prop({ default: false })
    public padding: boolean;
    @Prop({ default: false })
    public paddingHeader: boolean;
    @Prop({ default: false })
    public paddingBody: boolean;
    @Prop({ default: false })
    public paddingFooter: boolean;
    @Prop({ default: true })
    public background: boolean;
    @Prop({ default: 'auto' })
    public width: string;

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

    public $refs: {
        popper: HTMLElement;
        body: HTMLElement;
    };

    private popper: Popper | undefined;
    private defaultAnimOpen: boolean = false;
    private internalOpen: boolean = false;
    private isHidden: boolean = false;
    private observer: MutationObserver;

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public getBackdropMode(): BackdropMode {
        return BackdropMode.None;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.popper;
    }

    public doCustomPropOpen(value: boolean, el: HTMLElement): boolean {
        if (value) {
            if (this.popper === undefined) {
                let options: object = {
                    placement: this.placement,
                    eventsEnabled: true,
                    onUpdate: (data: Popper.Data) => {
                        this.isHidden = data.hide;
                    },
                    modifiers: {
                        preventOverflow: {
                            boundariesElement: 'window'
                        }
                    }
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
            this.popper.scheduleUpdate();
        }
    }

    protected mounted(): void {
        this.$modul.event.$on('updateAfterResize', this.update);

        // sometimes, the document.click event is stopped causing a menu to stay open, even if another menu has been clicked.
        // mouseup will always be caught even if click is stopped.
        document.addEventListener('mouseup', this.onDocumentClick);

        this.$on('portal-mounted', this.setPopperMutationObserver);

    }

    protected beforeDestroy(): void {
        this.$modul.event.$off('updateAfterResize', this.update);
        document.removeEventListener('mouseup', this.onDocumentClick);

        if (this.observer) { this.observer.disconnect(); }

        this.$off('portal-mounted', this.setPopperMutationObserver);

        this.destroyPopper();
    }

    public get popupBody(): HTMLElement {
        return this.$refs.body;
    }

    private setPopperMutationObserver(): void {
        this.observer = new MutationObserver(() => {
            this.update();
        });
        if (this.$refs.popper) {
            this.observer.observe(this.$refs.popper, { subtree: true, childList: true });
        }
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.as<PortalMixin>().propOpen) {
            let trigger: HTMLElement | undefined = this.as<PortalMixin>().getTrigger();
            const element: HTMLElement = this.as<PortalMixin>().getPortalElement();
            if (!(element && element.contains(event.target as Node) || this.$el.contains(event.target as HTMLElement) ||
                (trigger && trigger.contains(event.target as HTMLElement)))) {
                this.as<PortalMixin>().propOpen = false;
            }
        }
    }

    private destroyPopper(): void {
        if (this.popper !== undefined) {
            this.popper.destroy();
            this.popper = undefined;
            this.isHidden = false;
        }
    }

    private get defaultAnim(): boolean {
        return !(this.beforeEnter || this.enter || this.afterEnter || this.beforeLeave || this.leave || this.afterLeave);
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private onBeforeEnter(el: HTMLElement): void {
        if (this.beforeEnter) {
            this.beforeEnter(el.children[0]);
        }
    }

    private onEnter(el: HTMLElement, done): void {
        this.$nextTick(() => {
            this.update();
            if (this.enter) {
                this.enter(el.children[0], done);
            } else {
                let transitionDuration: number = (window.getComputedStyle(el).getPropertyValue('transition-duration').slice(1, -1) as any) * 1000;
                setTimeout(() => {
                    this.defaultAnimOpen = true;
                    done();
                }, transitionDuration);
            }
        });
    }

    private onAfterEnter(el: HTMLElement): void {
        if (this.afterEnter) {
            this.afterEnter(el.children[0]);
        }
        this.$emit('after-enter', el);
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
        v.component(POPPER_NAME, MPopper);
    }
};

export default PopperPlugin;
