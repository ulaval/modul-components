import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './popper.html?style=./popper.scss';
import { POPPER_NAME } from '../component-names';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import Popper from 'popper.js';

const TRIGGER_CLICK = 'click';
const TRIGGER_HOVER = 'hover';
const DIALOG_MODE_PRIMARY = 'primary';
const DIALOG_MODE_SECONDARY = 'secondary';
const DIALOG_MODE_PANEL = 'panel';

export interface IPopperOptions {
    placement: string;
    gpuAcceleration: boolean;
    modifiers: any;
    onCreate: Function;
}

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MPopper extends Vue {
    @Prop({
        default: TRIGGER_CLICK,
        validator: (value) => [TRIGGER_CLICK, TRIGGER_HOVER].indexOf(value) > -1
    })
    public trigger: string;
    @Prop({ default: false })
    public open: boolean;
    @Prop()
    public boundariesSelector: string;
    @Prop({ default: false })
    public forceShow: boolean;
    @Prop({ default: false })
    public arrow: boolean;
    @Prop()
    public options: any;
    @Prop({ default: false })
    public closeOnContentClick: boolean;
    @Prop({ default: true })
    public closeOnReferenceClick: boolean;
    @Prop({ default: DIALOG_MODE_PANEL })
    public mobileMode: string;

    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    @Prop()
    public beforeEnterFn: any;
    @Prop()
    public enterFn: any;
    @Prop()
    public afterEnterFn: any;
    @Prop()
    public enterCancelledFn: any;
    @Prop()
    public beforeLeaveFn: any;
    @Prop()
    public leaveFn: any;
    @Prop()
    public afterLeaveFn: any;
    @Prop()
    public leaveCancelledFn: any;

    public componentName: string = POPPER_NAME;
    public isScreenMaxS: boolean;
    public referenceElm: HTMLElement;
    public popperJS;
    public showPopper: boolean = false;
    public animPopperActive: boolean = false;
    public currentPlacement: string = '';
    public popperOptions: IPopperOptions = {
        placement: 'bottom',
        gpuAcceleration: false,
        modifiers: {},
        onCreate: () => { }
    };

    private propMode: string;
    private popper;
    private appended: boolean;
    private _timer: number;

    @Watch('showPopper')
    public showPopperChanged(value) {
        if (value) {
            this.updatePopper();
            this.$emit('show');
        } else {
            setTimeout(() => {
                this.doDestroy();
            }, 300);
            this.$emit('hide');
        }
    }

    @Watch('forceShow', { immediate: true })
    public forceShowChanged(value) {
        this[value ? 'doShow' : 'doClose']();
    }

    @Watch('open')
    public openChanged(value) {
        this.showPopper = this.open;
    }

    private created(): void {
        this.popperOptions = { ...this.popperOptions, ...this.options };
    }

    private mounted(): void {
        if ((this.$slots.content) && (this.$slots.default)) {
            this.referenceElm = this.$refs.reference as HTMLElement;
            this.popper = this.$refs.popper;
            on(document, 'click', this.handleDocumentClick);
            this.createPopper();
        }
    }

    private destroyed() {
        this.destroyPopper();
    }

    private createPopper(): void {
        this.$nextTick(() => {
            if (this.arrow) {
                this.appendArrow(this.popper);
            }

            if (this.popperJS && this.popperJS.destroy) {
                this.popperJS.destroy();
            }

            if (this.boundariesSelector) {
                const boundariesElement = document.querySelector(this.boundariesSelector);

                if (boundariesElement) {
                    this.popperOptions.modifiers = { ...this.popperOptions.modifiers };
                    this.popperOptions.modifiers.preventOverflow = { ...this.popperOptions.modifiers.preventOverflow };
                    this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
                }
            }

            this.popperOptions.onCreate = () => {
                this.$emit('created', this);
                this.$nextTick(this.updatePopper);
            };

            this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
        });
    }

    private destroyPopper(): void {
        off(document, 'click', this.handleDocumentClick);
        this.popperJS = undefined;
    }

    private doDestroy(): void {
        if (this.showPopper || !this.popperJS) {
            return;
        }
        this.popperJS.destroy();
        this.popperJS = undefined;
    }

    private appendArrow(element): void {
        if (this.appended) {
            return;
        }

        this.appended = true;

        const arrow = document.createElement('div');
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
    }

    private updatePopper(): void {
        this.popperJS ? this.popperJS.update() : this.createPopper();
    }

    private onClick(): void {
        if (this.trigger == TRIGGER_CLICK) {
            this.doToggle();
        }
    }

    private doToggle(): void {
        if (!this.forceShow) {
            if (this.closeOnReferenceClick) {
                this.showPopper = !this.showPopper;
            } else {
                this.doShow();
            }
        }
    }

    private onContentClick(): void {
        if (this.closeOnContentClick) {
            this.doClose();
        }
    }

    private doShow(): void {
        this.showPopper = true;
        clearTimeout(this._timer);
    }

    private doClose(): void {
        this.showPopper = false;
    }

    private onMouseOver(): void {
        if (this.trigger == TRIGGER_HOVER) {
            this.showPopper = true;
            clearTimeout(this._timer);
        }
    }

    private onMouseOut(): void {
        if (this.trigger == TRIGGER_HOVER) {
            this._timer = window.setTimeout(() => {
                this.showPopper = false;
            }, 10);
        }
    }

    private handleDocumentClick(e): void {
        if (!this.$el || !this.referenceElm || !this.popper ||
            this.$el.contains(e.target) ||
            this.referenceElm.contains(e.target) ||
            this.popper.contains(e.target) ||
            this.forceShow) {
            return;
        }
        this.showPopper = false;
    }

    private get propMobileMode(): string {
        return this.mobileMode == DIALOG_MODE_PRIMARY || this.mobileMode == DIALOG_MODE_SECONDARY ? this.mobileMode : DIALOG_MODE_PANEL;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasContentSlot(): boolean {
        return !!this.$slots.content;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private animEnter(el, done): void {
        this.animPopperActive = true;
        if (typeof (this.enterFn) === 'function') {
            this.enterFn(el, done);
        }
    }

    private animAfterEnter(el): void {
        if (typeof (this.afterEnterFn) === 'function') {
            this.afterEnterFn(el);
        }
    }

    private animEnterCancelled(el): void {
        if (typeof (this.enterCancelledFn) === 'function') {
            this.enterCancelledFn(el);
        }
    }

    private animBeforeLeave(el): void {
        if (typeof (this.beforeLeaveFn) === 'function') {
            this.beforeLeaveFn(el);
        }
    }

    private animLeave(el, done): void {
        if (typeof (this.leaveFn) === 'function') {
            this.leaveFn(el, done);
        } else {
            done();
        }
    }

    private animAfterLeave(el): void {
        this.animPopperActive = false;
        if (typeof (this.afterLeaveFn) === 'function') {
            this.afterLeaveFn(el);
        }
    }

    private animLeaveCancelled(el): void {
        if (typeof (this.leaveCancelledFn) === 'function') {
            this.leaveCancelledFn(el);
        }
    }
}

const PopperPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(POPPER_NAME, MPopper);
    }
};

export default PopperPlugin;

// Add and remove events listeners that support IE implementation.
function on(element, event, handler) {
    if (element && event && handler) {
        document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
}

function off(element, event, handler) {
    if (element && event) {
        document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler);
    }
}
