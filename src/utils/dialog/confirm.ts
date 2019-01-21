import Vue, { PluginObject } from 'vue';

import { MDialog } from '../../components/dialog/dialog';

export interface ConfirmOptions {
    okLabel?: string;
    cancelLabel?: string;
    silentCancel?: boolean;
}

export type ConfirmFunction = (message: string, options?: ConfirmOptions) => Promise<any>;

let confirmInstance: MDialog | undefined = undefined;

export const confirmFunction: ConfirmFunction = (message: string, options?: ConfirmOptions) => {
    if (!confirmInstance) {
        confirmInstance = new MDialog({
            el: document.createElement('div')
        });

        document.body.appendChild(confirmInstance.$el);
    }
    confirmInstance.message = message;
    confirmInstance.okLabel = options && options.okLabel ? options.okLabel : undefined;
    confirmInstance.cancelLabel = options && options.cancelLabel ? options.cancelLabel : undefined;

    return new Promise((resolve, reject) => {
        let onOk: () => void = () => {
            if (confirmInstance) {
                unhook();
            }

            Vue.nextTick(() => {
                resolve();
            });
        };

        let onCancel: () => void = () => {
            if (confirmInstance) {
                unhook();
            }
            if (!(options && options.silentCancel)) {
                reject();
            }
        };

        let hook: () => void = () => {
            if (confirmInstance) {
                confirmInstance.$on('ok', onOk);
                confirmInstance.$on('cancel', onCancel);
                confirmInstance.$props['open'] = true;
            }
        };

        let unhook: () => void = () => {
            if (confirmInstance) {
                confirmInstance.$off('ok', onOk);
                confirmInstance.$off('cancel', onCancel);
                confirmInstance.$props['open'] = false;
            }
        };

        if (confirmInstance) {
            confirmInstance.$nextTick(() => {
                hook();
            });
        } else {
            console.error('No instance of dialog');
            reject();
        }
    });
};

const ConfirmPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('ConfirmPlugin will be deprecated in modul v.1.0');

        (v.prototype as any).$confirm = confirmFunction;
    }
};

export default ConfirmPlugin;
