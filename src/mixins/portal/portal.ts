import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { MOpenTrigger, OpenTrigger, OpenTriggerMixin } from '../open-trigger/open-trigger';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';

export interface PortalMixin {
    propOpen: boolean;
    getPortalElement(): HTMLElement;
    getTrigger(): HTMLElement | undefined;
    setFocusToPortal(): void;
    setFocusToTrigger(): void;
    tryClose(): boolean;
}

export interface PortalMixinImpl {
    doCustomPropOpen(value: boolean, el: HTMLElement): boolean;
    handlesFocus(): boolean;
    getBackdropMode(): BackdropMode;
    getPortalElement(): HTMLElement;
}

export enum BackdropMode {
    None,
    ScrollOnly,
    BackdropFast,
    BackdropSlow
}

export enum PortalTransitionDuration {
    Fast = 200,
    Regular = 300,
    Slow = 450,
    XSlow = 600
}

@Component({
    mixins: [OpenTrigger, MediaQueries]
})
export class Portal extends ModulVue implements PortalMixin {
    @Prop({
        default: MOpenTrigger.Click,
        validator: value =>
            value == MOpenTrigger.Click ||
            value == MOpenTrigger.Hover ||
            value == MOpenTrigger.Manual
    })
    public openTrigger: MOpenTrigger;

    @Prop()
    public open: boolean;

    @Prop({ default: 'mPortal' })
    public id: string;

    @Prop()
    public disabled: boolean;

    @Prop()
    public trigger: HTMLElement;

    @Prop()
    public className: string;

    private internalTrigger: HTMLElement | undefined = undefined;
    private propId: string = '';
    private portalTargetEl: HTMLElement;
    private internalOpen: boolean = false;
    private stackId: string;
    private internalTransitionDuration: number = PortalTransitionDuration.Regular;

    public setFocusToPortal(): void {
        if (this.as<PortalMixinImpl>().handlesFocus()) {
            let el: HTMLElement = this.as<PortalMixinImpl>().getPortalElement();
            let x: number = window.pageXOffset; // AEL-53
            let y: number = window.pageYOffset; // AEL-53
            el.setAttribute('tabindex', '0');
            el.focus();
            window.scrollTo(x, y); // AEL-53
            el.blur();
            el.removeAttribute('tabindex');
        }
    }

    public setFocusToTrigger(): void {
        if (this.as<PortalMixinImpl>().handlesFocus() && this.internalTrigger) {
            this.internalTrigger.setAttribute('tabindex', '0');
            this.internalTrigger.focus();
            this.internalTrigger.blur();
            this.internalTrigger.removeAttribute('tabindex');
        }
    }

    public getPortalElement(): HTMLElement {
        return this.portalTargetEl;
    }

    public getTrigger(): HTMLElement | undefined {
        return this.internalTrigger;
    }

    public tryClose(): boolean {
        if (this.$modul.peekElement() == this.stackId) {
            this.propOpen = false;
            return true;
        } else {
            return false;
        }
    }

    protected beforeMount(): void {
        this.propId = this.id + '-' + uuid.generate();
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('id', this.propId);
        document.body.appendChild(element);
    }

    protected mounted(): void {
        this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
        this.handleTrigger();
    }

    protected beforeDestroy(): void {
        this.propOpen = false;
        if (this.internalTrigger) {
            this.internalTrigger.removeEventListener('click', this.toggle);
            this.internalTrigger.removeEventListener('mouseenter', this.handleMouseEnter);
            this.internalTrigger.removeEventListener('mouseleave', this.handleMouseLeave);
        }

        document.body.removeChild(this.portalTargetEl);
    }

    public get propOpen(): boolean {
        return (this.open == undefined ? this.internalOpen : this.open) && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value != this.internalOpen) {
            if (value) {
                if (this.portalTargetEl) {
                    this.stackId = this.$modul.pushElement(this.portalTargetEl, this.as<PortalMixinImpl>().getBackdropMode(), this.as<MediaQueriesMixin>().isMqMaxS);
                    if (!this.as<PortalMixinImpl>().doCustomPropOpen(value, this.portalTargetEl)) {
                        this.portalTargetEl.style.position = 'absolute';

                        setTimeout(() => {
                            this.setFocusToPortal();
                        }, this.transitionDuration);
                    }
                }
            } else {
                if (this.portalTargetEl) {
                    this.$modul.popElement(this.stackId);

                    if (!this.as<PortalMixinImpl>().doCustomPropOpen(value, this.portalTargetEl)) {
                        setTimeout(() => {
                            // $emit update:open has been launched, animation already occurs
                            this.portalTargetEl.style.position = '';
                            this.setFocusToTrigger();
                        }, this.transitionDuration);
                    }
                }
            }
            if (value != this.internalOpen) {
                // really closing, reset focus
                this.$emit(value ? 'open' : 'close');
            }
        }
        this.internalOpen = value;
        this.$emit('update:open', value);
    }

    public get transitionDuration(): number {
        return this.internalTransitionDuration;
    }

    public set transitionDuration(speed: number) {
        this.internalTransitionDuration = speed;
    }

    @Watch('trigger')
    private onTriggerChange(): void {
        this.handleTrigger();
    }

    @Watch('internalTriggerHook')
    private onTriggerHookChange(): void {
        this.handleTrigger();
    }

    private handleTrigger(): void {
        if (this.internalTrigger) {
            console.warn('portal.ts : Trigger change or multiple triggers not supported');
        }
        if (this.trigger) {
            this.internalTrigger = this.trigger;
        } else if (this.$slots.trigger && this.$slots.trigger[0]) {
            this.internalTrigger = this.$slots.trigger[0].elm as HTMLElement;
        } else if (this.as<OpenTriggerMixin>().triggerHook) {
            this.internalTrigger = this.as<OpenTriggerMixin>().triggerHook;
        }
        if (this.internalTrigger) {
            if (this.openTrigger == MOpenTrigger.Click) {
                this.internalTrigger.addEventListener('click', this.toggle);
            } else if (this.openTrigger == MOpenTrigger.Hover) {
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

    private handleMouseEnter(): void {
        this.propOpen = true;
    }

    private handleMouseLeave(): void {
        this.propOpen = false;
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }
}
