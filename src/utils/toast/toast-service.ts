import { PluginObject } from 'vue/types/plugin';
import { VNode } from 'vue/types/vnode';
import { MMessageState } from '../../components/message/message';
import { MToast, MToastPosition } from '../../components/toast/toast';

export interface ToastParams {
    text: string;
    actionLabel?: string;
    state?: MMessageState;
    position?: MToastPosition;
    timeout?: number;
    icon?: boolean;
}
export class ToastService {
    public activeToast: MToast;
    public toasts: MToast[] = [];
    public show(params: ToastParams): void {
        const toast: MToast = this.createToast(params);
        this.toasts.push(toast);

        if (!this.activeToast) {
            this.activeToast = this.toasts[0];
        } else {
            this.activeToast.open = false;
            this.activeToast = this.toasts[1];
            this.toasts.splice(0, 1);
        }
    }

    public clear(): void {
        this.activeToast.open = false;
        this.toasts = [];
        delete (this.activeToast);
    }

    private createToast(params: ToastParams): MToast {
        const toast: MToast = new MToast({
            el: document.createElement('div'),
            propsData: {
                ['open.sync']: true,
                state: params.state,
                position: params.position,
                timeout: params.timeout,
                actionLabel: params.actionLabel,
                icon: params.icon
            }
        });

        const vnode: VNode = toast.$createElement('p', [params.text]);
        toast.$slots.default = [vnode];
        return toast;
    }
}

const ToastPlugin: PluginObject<any> = {
    install(v): void {
        let toast: ToastService = new ToastService();
        (v.prototype as any).$toast = toast;
    }
};

export default ToastPlugin;
