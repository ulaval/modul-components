import { PluginObject } from 'vue';
import { MModal } from '../../components/modal-window/modal-window';

export type ConfirmFunction = (message: string) => Promise<any>;

let confirmInstance: MModal | undefined = undefined;

export const confirmFunction: ConfirmFunction = (message: string) => {
    if (!confirmInstance) {
        confirmInstance = new MModal({
            el: document.createElement('div'),
            propsData: {
                message: message
            }
        });

        document.body.appendChild(confirmInstance.$el);
    }

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
            reject();
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
                if (confirmInstance) {

                }
            });
        } else {
            console.error('No instance of modal dialog');
            reject();
        }
    });
};

const ConfirmPlugin: PluginObject<any> = {
    install(v, options) {
        (v as any).$confirm = confirmFunction;
        (v.prototype as any).$confirm = confirmFunction;
    }
};

export default ConfirmPlugin;
