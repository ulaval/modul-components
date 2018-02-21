import { PluginObject } from 'vue';
import { MModal } from '../../components/modal/modal';

export interface ConfirmOptions {
    okLabel?: string;
    cancelLabel?: string;
    silentCancel?: boolean;
}

export type ConfirmFunction = (message: string, options?: ConfirmOptions) => Promise<any>;

let confirmInstance: MModal | undefined = undefined;

export const confirmFunction: ConfirmFunction = (message: string, options?: ConfirmOptions) => {
    if (!confirmInstance) {
        confirmInstance = new MModal({
            el: document.createElement('div')
        });

        document.body.appendChild(confirmInstance.$el);
    }
    confirmInstance.message = message;
    confirmInstance.okLabel = options && options.okLabel ? options.okLabel : undefined;
    confirmInstance.cancelLabel = options && options.cancelLabel ? options.cancelLabel : undefined;

    return new Promise((resolve, reject) => {
        let onOk = () => {
            if (confirmInstance) {
                unhook();
            }
            resolve();
        };

        let onCancel = () => {
            if (confirmInstance) {
                unhook();
            }
            if (!(options && options.silentCancel)) {
                reject();
            }
        };

        let hook = () => {
            if (confirmInstance) {
                confirmInstance.$on('ok', onOk);
                confirmInstance.$on('cancel', onCancel);
                confirmInstance.$props['open'] = true;
            }
        };

        let unhook = () => {
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
            console.error('No instance of modal dialog');
            reject();
        }
    });
};

const ConfirmPlugin: PluginObject<any> = {
    install(v, options) {
        (v.prototype as any).$confirm = confirmFunction;
    }
};

export default ConfirmPlugin;
