import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { MouseButtons } from '../../utils/mouse/mouse';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { MediaQueries, MediaQueriesMixin } from '../media-queries/media-queries';
import { MOpenTrigger, OpenTrigger, OpenTriggerMixin } from '../open-trigger/open-trigger';

export interface PortalMixin {
    propOpen: boolean;
    preload: boolean;
    loaded: boolean;
    getPortalElement(): HTMLElement;
    getTrigger(): HTMLElement | undefined;
    setFocusToPortal(): void;
    setFocusToTrigger(): void;
    tryClose(): void;
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
            value === MOpenTrigger.Click ||
            value === MOpenTrigger.Hover ||
            value === MOpenTrigger.Manual ||
            value === MOpenTrigger.MouseDown
    })
    public openTrigger: MOpenTrigger;

    @Prop()
    public open: boolean;

    @Prop()
    public id: string;

    @Prop()
    public disabled: boolean;

    @Prop()
    public trigger: HTMLElement;

    @Prop()
    public className: string;

    @Prop()
    public preload: boolean;

    @Prop({ default: true })
    public lazy: boolean;

    public loaded: boolean = false;

    private internalTrigger: HTMLElement | undefined = undefined;
    private propId: string = '';
    private portalTargetEl: HTMLElement;
    private internalOpen: boolean = false;
    private stackId: string;
    private internalTransitionDuration: number = PortalTransitionDuration.Regular;
    private opening: boolean = false;
    private portalTargetCreated: boolean = false;
    private portalTargetMounted: boolean = false;

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

    public async tryClose(): Promise<void> {
        if ((this as any).$toast) {
            await (this as any).$toast.clear(); // @todo Portal should not know toast
        }
        if (this.$modul.peekElement() === this.stackId) {
            if (this.$listeners && this.$listeners.beforeClose) {
                this.$emit('portal-before-close', (close: boolean) => {
                    this.propOpen = !close;
                });
            } else {
                this.propOpen = false;
            }
        }
    }

    protected created(): void {
        if (!this.$modul) {
            throw new Error('Portal mixin -> this.$modul is undefined, you must install the Modul plugin.');
        }
    }

    protected mounted(): void {
        this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
        this.handleTrigger();
        if (!this.lazy) { this.ensurePortalTargetEl(); }
    }

    protected beforeDestroy(): void {
        this.propOpen = false;
        if (this.internalTrigger) {
            this.internalTrigger.removeEventListener('click', this.toggle);
            this.internalTrigger.removeEventListener('mouseenter', this.handleMouseEnter);
        }

        if (this.portalTargetEl && this.portalTargetEl.parentNode) {
            this.portalTargetEl.parentNode.removeChild(this.portalTargetEl);
            this.portalTargetCreated = false;
            this.portalTargetMounted = false;
        }
    }

    public get propOpen(): boolean {
        let open: boolean = (this.open === undefined ? this.internalOpen : this.open) && !this.disabled;
        if (open) {
            this.loaded = true;
        }
        return open;
    }

    public set propOpen(value: boolean) {
        if (value !== this.internalOpen) {
            if (value) {
                this.ensurePortalTargetEl(() => {
                    if (this.portalTargetEl) {
                        this.stackId = this.$modul.pushElement(this.portalTargetEl, this.as<PortalMixinImpl>().getBackdropMode(), this.as<MediaQueriesMixin>().isMqMaxS);

                        if (!this.as<PortalMixinImpl>().doCustomPropOpen(value, this.portalTargetEl)) {
                            this.portalTargetEl.style.position = 'absolute';
                            this.portalTargetEl.style.top = '0';
                            this.portalTargetEl.style.left = '0';

                            // this.opening is important since it's fix a race condition where the portal
                            // could appear behind the content of the page if it was toggled too quickly.
                            this.opening = true;
                            setTimeout(() => {
                                this.$emit('portal-after-open');
                                this.setFocusToPortal();
                                this.opening = false;
                            }, this.transitionDuration);
                        } else {
                            this.$emit('portal-after-open');
                        }
                    }
                });
            } else {
                if (this.portalTargetEl) {
                    this.$modul.popElement(this.stackId);

                    if (!this.as<PortalMixinImpl>().doCustomPropOpen(value, this.portalTargetEl)) {
                        this.setFocusToTrigger();

                        setTimeout(() => {
                            // $emit update:open has been launched, animation already occurs
                            if (!this.opening) {
                                this.portalTargetEl.style.position = '';
                                this.$emit('portal-after-close');
                            }
                        }, this.transitionDuration);
                    } else {
                        this.$emit('portal-after-close');
                    }
                }
            }
            if (value !== this.internalOpen) {
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

    public get portalTargetSelector(): string {
        return this.propId ? `#${this.propId}` : '';
    }

    public get portalCreated(): boolean {
        return this.portalTargetCreated;
    }

    public get portalMounted(): boolean {
        return (this.propOpen || this.preload || this.loaded) && (this.portalTargetMounted || !this.lazy);
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
        if (this.trigger) {
            this.internalTrigger = this.trigger;
        } else if (this.$slots.trigger && this.$slots.trigger[0]) {
            this.internalTrigger = this.$slots.trigger[0].elm as HTMLElement;
        } else if (this.as<OpenTriggerMixin>().triggerHook) {
            this.internalTrigger = this.as<OpenTriggerMixin>().triggerHook;
        }
        if (this.internalTrigger) {
            switch (this.openTrigger) {
                case MOpenTrigger.Click:
                    this.internalTrigger.addEventListener('click', this.toggle);
                    break;
                case MOpenTrigger.MouseDown:
                    this.internalTrigger.addEventListener('mousedown', this.toggle);
                    break;
                case MOpenTrigger.Hover:
                    this.internalTrigger.addEventListener('mouseenter', this.handleMouseEnter);
                    // Closing not supported for the moment, check source code history for how was handled mouse leave
                    break;
            }
        }
    }

    private toggle(event: MouseEvent): void {
        if (event.button !== undefined && event.button === MouseButtons.LEFT) {
            this.propOpen = !this.propOpen;
            this.$emit('click', event);
        }
    }

    private handleMouseEnter(): void {
        this.propOpen = true;
    }

    private ensurePortalTargetEl(onPortalReady: () => void = () => { }): void {
        if (!this.portalTargetEl) {
            this.propId = this.id === undefined ? 'mPortal-' + uuid.generate() : this.id;
            this.portalTargetEl = document.createElement('div');
            this.portalTargetEl.setAttribute('id', this.propId);
            this.portalTargetEl.classList.add('m-u--app-body');
            document.body.appendChild(this.portalTargetEl);
            this.portalTargetCreated = true;

            // We wait for the portal creation / mounting.
            this.$nextTick(() => {
                this.portalTargetMounted = true;
                this.portalTargetEl = document.querySelector(this.portalTargetSelector) as HTMLElement;
                this.$emit('portal-mounted');
                onPortalReady();
            });
        } else {
            onPortalReady();
        }
    }

    @Watch('open', {
        immediate: true
    })
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }
}
