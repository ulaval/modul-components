
import { Component } from 'vue-property-decorator';
import { PluginObject } from 'vue/types/plugin';
import { MToastPosition, MToastState, MToastTimeout } from '../../components/toast/toast';
import { ModulVue } from '../vue/vue';
import { ToastParams } from './toast-service';
import ToastServicePlugin from './toast-service.plugin';
import WithRender from './toast-service.sandbox.html';

@WithRender
@Component
export class MToastServiceSandbox extends ModulVue {
    public toastTimeout: MToastTimeout = MToastTimeout.long;

    public simpleToastParams: ToastParams = {
        text: 'A simple toast with text',
        actionLabel: 'txt',
        action: this.action
    };

    created(): void {
        this.$toast.baseTopPosition = '60px';
    }

    destroy(): void {
        this.clear();
    }

    public init(): void {
        this.$toast.show(this.simpleToastParams);
    }

    public otherToast(): void {
        this.$toast.show({
            text: 'Other toast',
            actionLabel: 'Action',
            action: this.action,
            timeout: this.toastTimeout
        });
    }

    public successToast(): void {
        this.$toast.show({
            text: 'success toast',
            actionLabel: 'UNDO',
            action: this.action,
            timeout: this.toastTimeout
        });
    }

    public clear(): void {
        this.$toast.clear();
    }

    public complex(): void {
        this.$toast.show({
            position: MToastPosition.TopCenter,
            actionLabel: 'ACTION',
            action: this.action,
            icon: true,
            state: MToastState.Warning,
            timeout: this.toastTimeout,
            text: 'Test of a Toast'
        });
    }

    public error(): void {
        this.$toast.show({
            text: 'You have an error',
            actionLabel: 'retry',
            action: this.action,
            icon: true,
            state: MToastState.Error,
            timeout: this.toastTimeout
        });
    }

    public html(): void {
        this.$toast.show({
            text: '<p>You have <strong> too many</strong> errors</p>',
            icon: true,
            state: MToastState.Error,
            timeout: this.toastTimeout
        });
    }

    public action(event: Event): void {
        alert(`Type of event ${event.type}`);
    }
}

const MToastServiceSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ToastServicePlugin);
        v.component(`m-toast-service-sandbox`, MToastServiceSandbox);
    }
};

export default MToastServiceSandboxPlugin;
