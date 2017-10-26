import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { OpenTriggerHook, OpenTriggerHookMixin } from '../open-trigger/open-trigger-hook';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';

export enum MOpenTrigger {
    Hover = 'hover',
    Click = 'click',
    Manual = 'manual'
}

export interface OpenTriggerMixin {
    propOpen: boolean;
}

export interface OpenTriggerMixinImpl {
    doCustomPropOpen(value: boolean, el: HTMLElement): void;
    handlesFocus(): boolean;
    hasBackdrop(): boolean;
    getPortalElement(): HTMLElement;
}

const TRANSITION_DURATION: number = 300;
const TRANSITION_DURATION_LONG: number = 600;

@Component({
    mixins: [OpenTriggerHook, MediaQueries]
})
export class OpenTrigger extends ModulVue implements OpenTriggerMixin {
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

    @Prop({ default: 'mOpenTrigger' })
    public id: string;

    @Prop({ default: false })
    public disabled: boolean;

    @Prop()
    public trigger: HTMLElement;

    private internalTrigger: HTMLElement | undefined = undefined;
    private propId: string = '';
    private portalTargetEl: HTMLElement;
    private internalOpen: boolean = false;

    // public getPortalTargetElement(): HTMLElement {
    //     return this.portalTargetEl;
    // }

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
        if (this.internalTrigger) {
            this.internalTrigger.removeEventListener('click', this.toggle);
            this.internalTrigger.removeEventListener('mouseenter', this.handleMouseEnter);
            this.internalTrigger.removeEventListener('mouseleave', this.handleMouseLeave);
        }
        this.$modul.event.$off('click', this.onDocumentClick);

        document.body.removeChild(this.portalTargetEl);
    }

    public get propOpen(): boolean {
        return (this.open === undefined ? this.internalOpen : this.open) && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value != this.internalOpen) {
            if (value) {
                this.as<OpenTriggerMixinImpl>().doCustomPropOpen(value, this.portalTargetEl);
                if (this.portalTargetEl) {
                    this.$modul.pushElement(this.portalTargetEl, this.as<OpenTriggerMixinImpl>().hasBackdrop());
                    this.portalTargetEl.style.position = 'absolute';

                    setTimeout(() => {
                        this.setFastFocusToElement(this.as<OpenTriggerMixinImpl>().getPortalElement());
                    }, this.transitionDuration);
                }

                if (value != this.internalOpen) {
                    this.$emit('open');
                }
            } else {
                if (this.portalTargetEl) {
                    this.$modul.popElement(this.portalTargetEl, this.as<OpenTriggerMixinImpl>().hasBackdrop(), true);

                    setTimeout(() => {
                        // $emit update:open has been launched, animation already occurs

                        this.portalTargetEl.style.position = '';
                        if (this.internalTrigger) {
                            this.setFastFocusToElement(this.internalTrigger);
                        }
                    }, this.transitionDuration);
                }
                if (value != this.internalOpen) {
                    // really closing, reset focus
                    this.$emit('close');
                }
            }
        }
        this.internalOpen = value;
        this.$emit('update:open', value);
    }

    private get transitionDuration(): number {
        return this.as<MediaQueriesMixin>().isMqMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
    }

    private setFastFocusToElement(el: HTMLElement): void {
        if (this.as<OpenTriggerMixinImpl>().handlesFocus()) {
            el.setAttribute('tabindex', '0');
            el.focus();
            el.blur();
            el.removeAttribute('tabindex');
        }
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
            console.warn('trigger change or multiple triggers not supported');
        }
        if (this.trigger) {
            this.internalTrigger = this.trigger;
        } else if (this.$slots.trigger && this.$slots.trigger[0]) {
            this.internalTrigger = this.$slots.trigger[0].elm as HTMLElement;
        } else if (this.as<OpenTriggerHookMixin>().triggerHook) {
            this.internalTrigger = this.as<OpenTriggerHookMixin>().triggerHook;
        }
        if (this.internalTrigger) {
            if (this.openTrigger == MOpenTrigger.Click) {
                this.internalTrigger.addEventListener('click', this.toggle);
                this.$modul.event.$on('click', this.onDocumentClick);
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

    private onDocumentClick(event: MouseEvent): void {
        if (!(this.portalTargetEl.contains(event.target as Node) || this.$el.contains(event.target as HTMLElement) ||
            (this.internalTrigger && this.internalTrigger.contains(event.target as HTMLElement)))) {
            this.propOpen = false;
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
