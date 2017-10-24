import Vue from 'vue';
import Component from 'vue-class-component';

export interface OpenTriggerHookMixin {
    triggerHook: HTMLElement | undefined;
}

@Component
export class OpenTriggerHook extends Vue implements OpenTriggerHookMixin {
    // should be initialized for reactivity
    private internalTriggerHook: HTMLElement | undefined = {} as HTMLElement;

    public get triggerHook(): HTMLElement | undefined {
        return Object.keys(this.internalTriggerHook).length == 0 ? undefined : this.internalTriggerHook;
    }

    public set triggerHook(value: HTMLElement | undefined) {
        this.internalTriggerHook = value;
    }
}
