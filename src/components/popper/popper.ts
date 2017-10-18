import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './popper.html?style=./popper.scss';
import { POPPER_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import Popper from 'popper.js';
import PortalPlugin from 'portal-vue';
import ModulPlugin from '../../utils/modul/modul';

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

export enum MPopperOpenTrigger {
    Hover = 'hover',
    Click = 'click',
    Manual = 'manual'
}

@WithRender
@Component
export class MPopper extends ModulVue {
    @Prop({ default: false })
    public open: boolean;

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

    // @Prop({ default: true })
    // public openOnClick: boolean;
    // @Prop({ default: false })
    // public openOnOver: boolean;
    @Prop({
        default: MPopperOpenTrigger.Click,
        validator: value =>
            value == MPopperOpenTrigger.Click ||
            value == MPopperOpenTrigger.Hover ||
            value == MPopperOpenTrigger.Manual
    })
    public openTrigger: MPopperOpenTrigger;

    @Prop()
    public trigger: any;

    @Prop({ default: 'mPopper' })
    public id: string;

    @Prop({ default: false })
    public disabled: boolean;

    @Prop({ default: '' })
    public classNamePortalTarget: string;

    @Prop({ default: true })
    public closeOnClickOutside: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

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

    // private internalOpen: boolean = false;
    private popper: Popper | undefined;
    // private internalVisible: boolean = false;
    private portalTargetEl: HTMLElement;
    private propId: string;

    private defaultAnimOpen: boolean = false;
    private internalTrigger: Node | undefined = undefined;

    protected beforeMount(): void {
        this.propId = this.id + '-' + uuid.generate();
        let element: HTMLElement = document.createElement('div') as HTMLElement;
        element.setAttribute('id', this.propId);
        element.setAttribute('class', this.classNamePortalTarget);
        document.body.appendChild(element);
    }

    protected mounted(): void {
        this.propOpen = this.open;
        this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
        this.$modul.event.$on('scroll', this.update);
        this.$modul.event.$on('resize', this.update);
        this.$modul.event.$on('updateAfterResize', this.update);

        this.handleTrigger();
    }

    protected beforeDestroy(): void {
        if (this.internalTrigger) {
            this.internalTrigger.removeEventListener('click', this.toggle);
            this.internalTrigger.removeEventListener('mouseenter', this.handleMouseEnter);
            this.internalTrigger.removeEventListener('mouseleave', this.handleMouseLeave);
        }
        this.$modul.event.$off('click', this.handleDocumentClick);
        this.$modul.event.$off('scroll', this.update);
        this.$modul.event.$off('resize', this.update);
        this.$modul.event.$off('updateAfterResize', this.update);
        this.destroyPopper();
        document.body.removeChild(this.portalTargetEl);
    }

    public get propOpen(): boolean {
        return this.open && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value) {
            // this.internalOpen = true;

            if (this.popper == undefined) {
                let options: object = {
                    placement: this.placement,
                    eventsEnabled: false
                };
                this.popper = new Popper(this.$el, this.portalTargetEl, options);
            } else {
                this.popper.update();
            }
            this.portalTargetEl.style.zIndex = String(this.$modul.windowZIndex);

            this.$emit('open');
            // Keep the timer to allow an element outside the component to open the popper
            // setTimeout(() => {
            //     this.$modul.event.$on('click', this.onClickOutside);
            // }, 0);
        } else {
            // this.internalOpen = false;
            // this.closePopper();
            // this.$modul.event.$off('click', this.onClickOutside);
            this.$emit('close');
        }
        this.$emit('update:open', value);
    }

    public get popupBody(): any {
        return (this.$refs.popper as Element).querySelector('.m-popup__body');
    }

    @Watch('trigger')
    private t(): void {
        this.handleTrigger();
    }

    private handleTrigger(): void {
        if (this.internalTrigger) {
            console.warn('trigger change or multiple triggers not supported');
        }
        if (this.trigger) {
            this.internalTrigger = this.trigger;
        } else if (this.$slots.trigger && this.$slots.trigger[0]) {
            this.internalTrigger = this.$slots.trigger[0].elm;
        }
        if (this.internalTrigger) {
            if (this.openTrigger == MPopperOpenTrigger.Click) {
                this.internalTrigger.addEventListener('click', this.toggle);
                this.$modul.event.$on('click', this.handleDocumentClick);
            } else if (this.openTrigger == MPopperOpenTrigger.Hover) {
                this.internalTrigger.addEventListener('mouseenter', this.handleMouseEnter);
                this.internalTrigger.addEventListener('mouseleave', this.handleMouseLeave);
                this.$nextTick(() => {
                    (this.$refs.popper as Element).addEventListener('mouseenter', this.handleMouseEnter);
                    (this.$refs.popper as Element).addEventListener('mouseleave', this.handleMouseLeave);
                });
            }
        }
    }

    private toggle(): void {
        this.propOpen = !this.propOpen;
    }

    // public get visible(): boolean {
    //     return this.internalVisible && !this.disabled;
    // }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private update(): void {
        if (this.popper !== undefined) {
            this.popper.update();
        }
    }

    // private closePopper(): void {
    //     this.setFastFocusToElement(this.$el);
    // }

    // private setFastFocusToElement(el: HTMLElement): void {
    //     if (this.focusManagement) {
    //         // el.setAttribute('tabindex', '0');
    //         // el.focus();
    //         // el.blur();
    //         // el.removeAttribute('tabindex');
    //     }
    // }

    private destroyPopper() {
        if (this.popper !== undefined) {
            this.popper.destroy();
            this.popper = undefined;
        }
    }

    // private getPortalTargetEl(): HTMLElement {
    //     // return document.getElementById(this.propId) as HTMLElement;
    //     return this.portalTargetEl;
    // }

    // private onClick(event: MouseEvent): void {
    //     if (this.openTrigger == MPopperOpenTrigger.Click && !this.disabled) {
    //         console.log('open on click');
    //         this.propOpen = !this.propOpen;
    //     }
    // }

    private handleDocumentClick(event: MouseEvent): void {
        console.log('outside click', event.target);
        if (!(this.portalTargetEl.contains(event.target as Node) || this.$el.contains(event.target as HTMLElement) ||
             (this.internalTrigger && this.internalTrigger.contains(event.target as HTMLElement)))) {
            this.propOpen = false;
        }
    }

    private handleMouseEnter(): void {
        this.propOpen = true;
    }

    private handleMouseLeave(): void {
        this.propOpen = false;
    }

    // private get propOpenOnClick(): boolean {
    //     return this.openOnOver ? true : this.openOnClick;
    // }

    // private get propCloseOnClickOutside(): boolean {
    //     return this.propOpen ? this.closeOnClickOutside : false;
    // }

    private get hasBodySlot(): boolean {
        return !!this.$slots.default;
    }

    private get defaultAnim(): boolean {
        return !(this.hasBeforeEnterAnim() || this.hasEnterAnim() || this.hasAfterEnterAnim() || this.hasBeforeLeaveAnim() || this.hasLeaveAnim() || this.hasAfterLeaveAnim());
    }

    private hasBeforeEnterAnim(): boolean {
        return typeof (this.beforeEnter) === 'function';
    }

    private hasEnterAnim(): boolean {
        return typeof (this.enter) === 'function';
    }

    private hasAfterEnterAnim(): boolean {
        return typeof (this.afterEnter) === 'function';
    }

    private hasBeforeLeaveAnim(): boolean {
        return typeof (this.beforeLeave) === 'function';
    }

    private hasLeaveAnim(): boolean {
        return typeof (this.leave) === 'function';
    }

    private hasAfterLeaveAnim(): boolean {
        return typeof (this.afterLeave) === 'function';
    }

    private onBeforeEnter(el: HTMLElement): void {
        if (this.hasBeforeEnterAnim()) {
            this.beforeEnter(el.children[0]);
        }
    }

    private onEnter(el: HTMLElement, done): void {
        this.$nextTick(() => {
            this.update();
        });
        if (this.hasEnterAnim()) {
            this.enter(el.children[0], done);
        } else {
            this.defaultAnimOpen = true;
            done();
        }
    }

    private onAfterEnter(el: HTMLElement): void {
        if (this.hasAfterEnterAnim()) {
            this.afterEnter(el.children[0]);
        }

        if (this.propOpen) {
            // this.setFastFocusToElement(el);
        }
    }

    private onEnterCancelled(el: HTMLElement): void {
        if (typeof (this.enterCancelled) === 'function') {
            this.enterCancelled(el);
        }
    }

    private onBeforeLeave(el: HTMLElement): void {
        if (this.hasBeforeLeaveAnim()) {
            this.beforeLeave(el.children[0]);
        }
    }

    private onLeave(el: HTMLElement, done): void {
        if (this.hasLeaveAnim()) {
            this.leave(el.children[0], done);

        } else {
            this.defaultAnimOpen = false;
            setTimeout(() => {
                done();
            }, 300);
        }
    }

    private onAfterLeave(el: HTMLElement): void {
        if (this.hasAfterLeaveAnim()) {
            this.afterLeave(el.children[0]);
        }
    }

    private onLeaveCancelled(el: HTMLElement): void {
        if (typeof (this.leaveCancelled) === 'function') {
            this.leaveCancelled(el.children[0]);
        }
    }
}

const PopperPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(PortalPlugin);
        v.use(ModulPlugin);
        v.component(POPPER_NAME, MPopper);
    }
};

export default PopperPlugin;
