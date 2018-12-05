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
const TIME_BEFORE_ANIMATION_IS_DONE: number = 2000;

export class ToastService {
    public activeToast?: MToast;
    public toasts: MToast[] = [];
    public baseTopPosition: string = '0';

    public show(params: ToastParams): void {
        const toast: MToast = this.createToast(params);
        this.toasts.push(toast);

        if (!this.activeToast) {
            this.activeToast = this.toasts[0];
        } else {
            this.activeToast.open = false;
            this.activeToast = this.toasts[1];
            const toastToDestroy: MToast = this.toasts.shift()!;
            setTimeout(() => {
                toastToDestroy.$destroy();
            }, TIME_BEFORE_ANIMATION_IS_DONE);
        }
    }

    public clear(): void {
        this.toasts.forEach((toast) => {
            toast.$destroy();
        });
        this.toasts = [];
        this.activeToast = undefined;
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

        toast.$on('close', () => setTimeout(() => toast.$destroy(), TIME_BEFORE_ANIMATION_IS_DONE));

        toast.offset = toast.isTop ? this.baseTopPosition : '0';

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
