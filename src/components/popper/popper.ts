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
    @Prop({ default: true })
    public open: boolean;
    @Prop({ default: false })
    public disabled: boolean;
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
    public isScreenMaxS: boolean;
    public referenceElm: HTMLElement;
    public popperJS;
    public isPopperOpen: boolean = false;
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

    private isDialogOpen: boolean = false;

    protected created(): void {
        this.popperOptions = { ...this.popperOptions, ...this.options };
    }

    protected mounted(): void {
        if ((this.$slots.body) && (this.$slots.default)) {
            if (!this.isScreenMaxS) {
                this.createPopper();
            }
            on(document, 'click', this.handleDocumentClick);
        }
    }

    protected destroyed() {
        this.destroyPopper();
    }

    @Watch('forceShow', { immediate: true })
    private forceShowChanged(value) {
        this[value ? 'openPopper' : 'closePopper']();
    }

    @Watch('isScreenMaxS')
    private isScreenMaxSChanged(value) {
        if (value) {
            this.doDestroy();
            this.isDialogOpen = this.isPopperOpen;
        } else {
            this.createPopper();
            this.closePopper();
            if (this.isDialogOpen) {
                setTimeout(() => {
                    this.openPopper();
                }, 2);
            }
        }
    }

    private createPopper(): void {
        this.$nextTick(() => {
            this.referenceElm = this.$refs.reference as HTMLElement;
            this.popper = this.$refs.popper;
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
        if (this.isPopperOpen || !this.popperJS) {
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

    private togglePopper(): void {
        if (!this.forceShow && !this.disabled) {
            if (this.closeOnReferenceClick) {
                if (this.isPopperOpen) {
                    this.closePopper();
                } else {
                    this.openPopper();
                }
            } else {
                this.openPopper();
            }
        }
    }

    private toggleDialog(value: boolean): void {
        this.isDialogOpen = value;
        if (value) {
            this.$emit('show');
        } else {
            this.$emit('hide');
        }
    }

    private onContentClick(): void {
        if (this.closeOnContentClick) {
            this.closePopper();
        }
    }

    private openPopper(): void {
        if (!this.isPopperOpen && !this.isScreenMaxS) {
            this.isPopperOpen = true;
            clearTimeout(this._timer);
            this.updatePopper();
            this.$emit('show');
        } else if (!this.isDialogOpen && this.isScreenMaxS) {
            this.isDialogOpen = true;
            clearTimeout(this._timer);
            this.updatePopper();
            this.$emit('show');
        }
    }

    private closePopper(): void {
        if (this.isPopperOpen && !this.isScreenMaxS) {
            this.isPopperOpen = false;
            this.$emit('hide');
        } else if (this.isDialogOpen && this.isScreenMaxS) {
            this.isDialogOpen = false;
            this.$emit('hide');
        }
    }

    private onMouseOver(): void {
        if (this.trigger == TRIGGER_HOVER && !this.isScreenMaxS) {
            this.openPopper();
        }
    }

    private onMouseOut(): void {
        if (this.trigger == TRIGGER_HOVER && !this.isScreenMaxS) {
            this._timer = window.setTimeout(() => {
                this.closePopper();
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
        this.closePopper();
    }

    private get propOpen(): boolean {
        if (!this.isScreenMaxS) {
            if (this.open) {
                this.openPopper();
            } else {
                this.closePopper();
            }
        } else {
            this.isDialogOpen = this.open;
        }
        return this.open;
    }

    private get propMobileMode(): string {
        return this.mobileMode == DIALOG_MODE_PRIMARY || this.mobileMode == DIALOG_MODE_SECONDARY ? this.mobileMode : DIALOG_MODE_PANEL;
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

    private onBeforeEnter(el: HTMLElement): void {
        if (typeof (this.beforeEnter) === 'function') {
            this.beforeEnter(el.children[0]);
        }
    }

    private onEnter(el: HTMLElement, done): void {
        this.animPopperActive = true;
        if (typeof (this.enter) === 'function') {
            this.enter(el.children[0], done);
        } else {
            done();
        }
    }

    private onAfterEnter(el: HTMLElement): void {
        if (typeof (this.afterEnter) === 'function') {
            this.afterEnter(el.children[0]);
        }
    }

    private onEnterCancelled(el: HTMLElement): void {
        if (typeof (this.enterCancelled) === 'function') {
            this.enterCancelled(el);
        }
    }

    private onBeforeLeave(el: HTMLElement): void {
        if (typeof (this.beforeLeave) === 'function') {
            this.beforeLeave(el.children[0]);
        }
    }

    private onLeave(el: HTMLElement, done): void {
        if (typeof (this.leave) === 'function') {
            this.leave(el.children[0], done);
        } else {
            done();
        }
    }

    private onAfterLeave(el: HTMLElement): void {
        this.animPopperActive = false;
        if (typeof (this.afterLeave) === 'function') {
            this.afterLeave(el.children[0]);
        }
        this.doDestroy();
    }

    private onLeaveCancelled(el: HTMLElement): void {
        if (typeof (this.leaveCancelled) === 'function') {
            this.leaveCancelled(el.children[0]);
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
