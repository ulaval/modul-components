import Vue from 'vue';
import Component from 'vue-class-component';

export interface OpenTriggerMixin {
    triggerHook: HTMLElement | undefined;
}

export enum MOpenTrigger {
    Hover = 'hover',
    Click = 'click',
    Manual = 'manual',
    MouseDown = 'mousedown'
}

@Component
export class OpenTrigger extends Vue implements OpenTriggerMixin {
    // should be initialized for reactivity (use of null instead of dummy class)
    // tslint:disable-next-line:no-null-keyword
    private internalTriggerHook: HTMLElement | null = null;

    public get triggerHook(): HTMLElement | undefined {
        return this.internalTriggerHook === null ? undefined : this.internalTriggerHook;
    }

    public set triggerHook(value: HTMLElement | undefined) {
        this.internalTriggerHook = value as HTMLElement;
    }
}
