import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './popper.html?style=./popper.scss';
import { POPPER_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import Popper from 'popper.js';

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
@Component
export class MPopper extends ModulVue {
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: MPopperPlacement.Bottom })
    public placement: MPopperPlacement;
    @Prop({ default: true })
    public openOnClick: boolean;
    @Prop({ default: false })
    public openOnOver: boolean;
    @Prop({ default: 'mPopper' })
    public id: string;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: '' })
    public classNamePortalTarget: string;
    @Prop({ default: true })
    public closeOnClickOutside: boolean;
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

    public componentName: string = POPPER_NAME;
    private internalOpen: boolean = false;
    private popper: Popper | undefined;
    private visible: boolean = false;
    private portalTargetEl: HTMLElement;
    private propId: string;

    private defaultAnimOpen: boolean = false;

    protected created(): void {
        this.propId = this.id + '-' + uuid.generate();
        let createPortalTargetEl: HTMLElement = document.createElement('div') as HTMLElement;
        createPortalTargetEl.setAttribute('id', this.propId);
        createPortalTargetEl.setAttribute('class', this.classNamePortalTarget);
        document.body.appendChild(createPortalTargetEl);
    }

    protected mounted(): void {
        this.propOpen = this.open;
        this.$mWindow.event.$on('click', (e: MouseEvent) => this.onClickOutside(e));
        this.$mWindow.event.$on('scroll', () => this.update());
        this.$mWindow.event.$on('resize', () => this.update());
    }

    protected destroyed(): void {
        this.destroyPopper();
        this.$mWindow.event.$off('click');
        this.$mWindow.event.$off('scroll');
        this.$mWindow.event.$off('resize');
        document.body.removeChild(this.getPortalTargetEl());
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private update(): void {
        if (this.popper != undefined) {
            this.popper.update();
        }
    }

    private openPopper(): void {
        if (!this.disabled) {
            this.visible = true;
            this.$nextTick(() => {
                let portalTargetEl: HTMLElement = this.getPortalTargetEl();
                if (this.popper == undefined) {
                    let options: object = {
                        placement: this.propPlacement,
                        eventsEnabled: false
                    };
                    this.popper = new Popper(this.$el, portalTargetEl, options);
                } else {
                    this.popper.update();
                }
                portalTargetEl.style.zIndex = String(this.$mWindow.windowZIndex);
                if (this.propOpen) {
                    this.setFastFocusToElement(portalTargetEl);
                }
            });
        }
    }

    private closePopper(): void {
        if (!this.disabled) {
            this.visible = false;
            this.setFastFocusToElement(this.$el);
        }
    }

    private setFastFocusToElement(el: HTMLElement): void {
        el.setAttribute('tabindex', '0');
        el.focus();
        el.blur();
        el.removeAttribute('tabindex');
    }

    private destroyPopper() {
        if (this.popper != undefined) {
            this.popper.destroy();
            this.popper = undefined;
        }
    }

    private getPortalTargetEl(): HTMLElement {
        return document.getElementById(this.propId) as HTMLElement;
    }

    private onClick(event: MouseEvent): void {
        if (this.propOpenOnClick && !this.disabled) {
            this.propOpen = !this.propOpen;
            if (this.propCloseOnClickOutside) {
                event.stopPropagation();
            }
        }
    }

    private onClickOutside(event: MouseEvent): void {
        if (!(this.getPortalTargetEl() as HTMLElement).contains(event.target as HTMLElement) && this.propCloseOnClickOutside) {
            this.propOpen = false;
        }
    }

    private onMouseOver(): void {
        if (!this.propOpen && this.openOnOver) {
            this.openPopper();
        }
    }

    private onMouseOut(): void {
        if (!this.propOpen && this.popper != undefined && this.openOnOver) {
            this.closePopper();
        }
    }

    private get propOpenOnClick(): boolean {
        return this.openOnOver ? true : this.openOnClick;
    }

    private get propCloseOnClickOutside(): boolean {
        return this.propOpen ? this.closeOnClickOutside : false;
    }

    private get propOpen(): boolean {
        return this.internalOpen;
    }

    private set propOpen(open) {
        if (!this.disabled) {
            if (open) {
                this.openPopper();
                this.$emit('open');
            } else {
                this.closePopper();
                this.$emit('close');
            }
            this.internalOpen = open;
        }
    }

    private get propPlacement(): MPopperPlacement {
        let placement: MPopperPlacement;
        switch (this.placement) {
            case MPopperPlacement.Top:
            case MPopperPlacement.TopStart:
            case MPopperPlacement.TopEnd:
            case MPopperPlacement.Right:
            case MPopperPlacement.RightStart:
            case MPopperPlacement.RightEnd:
            case MPopperPlacement.BottomStart:
            case MPopperPlacement.BottomEnd:
            case MPopperPlacement.Left:
            case MPopperPlacement.LeftStart:
            case MPopperPlacement.LeftEnd:
                placement = this.placement;
                break;
            default:
                placement = MPopperPlacement.Bottom;
        }
        return placement;
    }

    private get defaultAnim(): boolean {
        return !this.hasBeforeEnterAnim() && !this.hasEnterAnim() && !this.hasAfterEnterAnim() && !this.hasBeforeLeaveAnim() && !this.hasLeaveAnim() && !this.hasAfterLeaveAnim();
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

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasBodySlot(): boolean {
        return !!this.$slots.body;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }
}

const PopperPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(POPPER_NAME, MPopper);
    }
};

export default PopperPlugin;
