import Vue from 'vue';
import Component from 'vue-class-component';

export interface OpenTriggerMixin {
    triggerHook: HTMLElement | undefined;
}

export enum MOpenTrigger {
    Hover = 'hover',
    Click = 'click',
    Manual = 'manual'
}

@Component
export class OpenTrigger extends Vue implements OpenTriggerMixin {
    // should be initialized for reactivity
    private internalTriggerHook: HTMLElement | undefined = {} as HTMLElement;

    public get triggerHook(): HTMLElement | undefined {
        return Object.keys(this.internalTriggerHook).length == 0 ? undefined : this.internalTriggerHook;
    }

    public set triggerHook(value: HTMLElement | undefined) {
        this.internalTriggerHook = value;
    }
}
