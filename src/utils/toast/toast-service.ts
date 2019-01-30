import { PluginObject } from 'vue/types/plugin';
import { VNode } from 'vue/types/vnode';
import { MToast, MToastPosition, MToastState, MToastTimeout } from '../../components/toast/toast';


declare module 'vue/types/vue' {
    interface Vue {
        $toast: ToastService;
    }
}

export interface ToastParams {
    text: string;
    actionLabel?: string;
    action?: (event: Event) => any;
    state?: MToastState;
    position?: MToastPosition;
    timeout?: MToastTimeout;
    icon?: boolean;
}

const TIME_BEFORE_ANIMATION_IS_OVER: number = 300;

export class ToastService {
    public activeToast?: MToast;
    public toasts: MToast[] = [];
    public baseTopPosition: string = '0';

    public show(params: ToastParams): void {
        const toast: MToast = this.createToast(params);
        this.toasts.push(toast);

        if (this.activeToast) {
            this.activeToast.open = false;
            this.activeToast = this.toasts[1];
            this.toasts.splice(0, 1);
        } else {
            this.activeToast = this.toasts[0];
        }
    }

    public async clear(): Promise<void> {
        if (this.activeToast) {
            this.activeToast.open = false;
        }
        this.toasts = [];
        this.activeToast = undefined;
        return new Promise<void>(resolve => {
            setTimeout(() => resolve(), TIME_BEFORE_ANIMATION_IS_OVER);
        });
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

        toast.$on('close', () => setTimeout(() => toast.$destroy(), TIME_BEFORE_ANIMATION_IS_OVER));
        if (params.action) {
            toast.$on('action-button', (event: Event) => {
                params.action!(event);
            });
        }

        toast.offset = toast.isTop ? this.baseTopPosition : '0';

        const vnode: VNode = toast.$createElement('p', [params.text]);
        toast.$slots.default = [vnode];
        return toast;
    }
}

const ToastServicePlugin: PluginObject<any> = {
    install(v): void {
        let toast: ToastService = new ToastService();
        (v.prototype).$toast = toast;
    }
};

export default ToastServicePlugin;
