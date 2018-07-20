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

    @Prop({ default: 'mPortal' })
    public id: string;

    @Prop()
    public disabled: boolean;

    @Prop()
    public trigger: HTMLElement;

    @Prop()
    public className: string;

    @Prop()
    public preload: boolean;

    public loaded: boolean = false;

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

    public tryClose(): void {
        if (this.$modul.peekElement() === this.stackId) {
            if (this.$listeners && this.$listeners.beforeClose) {
                this.$emit('beforeClose', (close: boolean) => {
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
        }

        document.body.removeChild(this.portalTargetEl);
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
            this.$log.warn('portal.ts : Trigger change or multiple triggers not supported');
        }
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

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }
}
