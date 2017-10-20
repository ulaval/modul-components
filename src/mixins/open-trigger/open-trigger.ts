import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

export enum MOpenTrigger {
    Hover = 'hover',
    Click = 'click',
    Manual = 'manual'
}

export interface OpenTriggerMixinImpl {
    propOpen: boolean;
    getPortalTargetElement(): HTMLElement;
}

export interface OpenTriggerMixin {
    getTrigger(): HTMLElement | undefined;
}

@Component
export class OpenTrigger extends ModulVue implements OpenTriggerMixinImpl, OpenTriggerMixin {
    @Prop({
        default: MOpenTrigger.Click,
        validator: value =>
            value == MOpenTrigger.Click ||
            value == MOpenTrigger.Hover ||
            value == MOpenTrigger.Manual
    })
    public openTrigger: MOpenTrigger;

    @Prop()
    public trigger: HTMLElement;

    private internalTrigger: HTMLElement | undefined = undefined;

    set propOpen(value: boolean) {
        // abstract
    }

    public getPortalTargetElement(): HTMLElement {
        // abstract
        throw Error('Not implemented exception (open-trigger)');
    }

    public getTrigger(): HTMLElement | undefined {
        return this.internalTrigger;
    }

    protected mounted(): void {
        this.handleTrigger();
    }

    protected beforeDestroy(): void {
        if (this.internalTrigger) {
            this.internalTrigger.removeEventListener('click', this.toggle);
            this.internalTrigger.removeEventListener('mouseenter', this.handleMouseEnter);
            this.internalTrigger.removeEventListener('mouseleave', this.handleMouseLeave);
        }
        this.$modul.event.$off('click', this.onDocumentClick);
    }

    @Watch('trigger')
    private onTriggerChange(): void {
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
        if (!(this.getPortalTargetElement().contains(event.target as Node) || this.$el.contains(event.target as HTMLElement) ||
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
}
