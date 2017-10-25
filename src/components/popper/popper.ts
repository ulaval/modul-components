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
import { OpenTrigger, OpenTriggerMixinImpl } from '../../mixins/open-trigger/open-trigger';
import { OpenTriggerHookMixin } from '../../mixins/open-trigger/open-trigger-hook';

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
    mixins: [OpenTrigger]
})
export class MPopper extends ModulVue implements OpenTriggerMixinImpl {
    @Prop()
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

    @Prop({ default: 'mPopper' })
    public id: string;

    @Prop({ default: false })
    public disabled: boolean;

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

    private popper: Popper | undefined;
    private portalTargetEl: HTMLElement;
    private propId: string = '';

    private defaultAnimOpen: boolean = false;
    private internalOpen: boolean = false;

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
        this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
        this.$modul.event.$on('scroll', this.update);
        this.$modul.event.$on('resize', this.update);
        this.$modul.event.$on('updateAfterResize', this.update);
    }

    protected beforeDestroy(): void {
        this.$modul.event.$off('scroll', this.update);
        this.$modul.event.$off('resize', this.update);
        this.$modul.event.$off('updateAfterResize', this.update);

        this.destroyPopper();
        document.body.removeChild(this.portalTargetEl);
    }

    public get popupBody(): any {
        return (this.$refs.popper as Element).querySelector('.m-popup__body');
    }

    public get propOpen(): boolean {
        return (this.open === undefined ? this.internalOpen : this.open) && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value) {
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

            if (value != this.internalOpen) {
                this.$emit('open');
            }
        } else {
            if (value != this.internalOpen) {
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

    private update(): void {
        if (this.popper !== undefined) {
            this.popper.update();
        }
    }

    private setFastFocusToElement(el: HTMLElement): void {
        if (this.focusManagement) {
            el.setAttribute('tabindex', '0');
            el.focus();
            el.blur();
            el.removeAttribute('tabindex');
        }
    }

    private destroyPopper() {
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
            this.defaultAnimOpen = true;
            done();
        }
    }

    private onAfterEnter(el: HTMLElement): void {
        if (this.afterEnter) {
            this.afterEnter(el.children[0]);
        }

        this.setFastFocusToElement(el);
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

        let trigger: HTMLElement | undefined = this.as<OpenTriggerHookMixin>().triggerHook;
        if (trigger) {
            this.setFastFocusToElement(trigger);
        }
    }

    private onLeaveCancelled(el: HTMLElement): void {
        if (this.leaveCancelled) {
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
