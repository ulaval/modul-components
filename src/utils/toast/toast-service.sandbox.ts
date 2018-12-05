
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
        actionLabel: 'txt'
    };

    public init(): void {
        this.$toast.show(this.simpleToastParams);
    }

    public otherToast(): void {
        this.$toast.show({
            text: 'Other toast',
            actionLabel: 'Action'
        });
    }

    public clear(): void {
        this.$toast.clear();
    }

    public complex(): void {
        this.$toast.show({
            position: MToastPosition.TopCenter,
            actionLabel: 'ACTION',
            icon: true,
            state: MMessageState.Warning,
            timeout: 2000,
            text: 'Test of a Toast'
        });
    }
}

const MToastServiceSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TOAST}-sandbox`, MToastServiceSandbox);
    }
};

export default MToastServiceSandboxPlugin;
