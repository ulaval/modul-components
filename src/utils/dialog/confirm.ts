import Vue, { PluginObject } from 'vue';

import { MDialog } from '../../components/dialog/dialog';

export interface ConfirmOptions {
    prBtnLabel?: string;
    secBtnLabel?: string;
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
    confirmInstance.prBtnLabel = options && options.prBtnLabel ? options.prBtnLabel : undefined;
    confirmInstance.secBtnLabel = options && options.secBtnLabel ? options.secBtnLabel : undefined;

    return new Promise((resolve, reject) => {
        let onPrimaryButton: () => void = () => {
            if (confirmInstance) {
                unhook();
            }

            Vue.nextTick(() => {
                resolve();
            });
        };

        let onSecondaryButton: () => void = () => {
            if (confirmInstance) {
                unhook();
            }
            if (!(options && options.silentCancel)) {
                reject();
            }
        };

        let hook: () => void = () => {
            if (confirmInstance) {
                confirmInstance.$on('primary', onPrimaryButton);
                confirmInstance.$on('secondary', onSecondaryButton);
                confirmInstance.$props['open'] = true;
            }
        };

        let unhook: () => void = () => {
            if (confirmInstance) {
                confirmInstance.$off('primary', onPrimaryButton);
                confirmInstance.$off('secondary', onSecondaryButton);
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
        (v.prototype as any).$confirm = confirmFunction;
    }
};

export default ConfirmPlugin;
