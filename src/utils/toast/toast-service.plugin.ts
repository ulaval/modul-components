import { PluginObject } from 'vue';
import ToastService from './toast-service';

declare module 'vue/types/vue' {
    interface Vue {
        $toast: ToastService;
    }
}

const ToastServicePlugin: PluginObject<any> = {
    install(v): void {
        let toast: ToastService = new ToastService();
        v.prototype.$toast = toast;
    }
};

export default ToastServicePlugin;
