
import { Component } from 'vue-property-decorator';
import { PluginObject } from 'vue/types/plugin';
import { MMessageState } from '../../components/message/message';
import { MToastPosition } from '../../components/toast/toast';
import { ModulVue } from '../../utils/vue/vue';
import { TOAST } from '../utils-names';
import { ToastParams } from './toast-service';
import WithRender from './toast-service.sandbox.html';

@WithRender
@Component
export class MToastServiceSandbox extends ModulVue {
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
            action: this.action
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
            state: MMessageState.Warning,
            timeout: 2000,
            text: 'Test of a Toast'
        });
    }

    public error(): void {
        this.$toast.error({
            text: 'You have an error',
            actionLabel: 'retry',
            action: this.action,
            icon: true
        });
    }

    public action(event: Event): void {
        alert(`Type of event ${event.type}`);
    }
}

const MToastServiceSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TOAST}-sandbox`, MToastServiceSandbox);
    }
};

export default MToastServiceSandboxPlugin;
