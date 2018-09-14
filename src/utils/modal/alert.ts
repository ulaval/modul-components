import Vue, { PluginObject } from 'vue';

import { MModal } from '../../components/modal/modal';

export interface AlertOptions {
    okLabel?: string;
}

export type AlertFunction = (message: string, options?: AlertOptions) => Promise<any>;

let AlertInstance: MModal | undefined = undefined;

export const alertFunction: AlertFunction = (message: string, options?: AlertOptions) => {
    if (!AlertInstance) {
        AlertInstance = new MModal({
            el: document.createElement('div')
        });

        document.body.appendChild(AlertInstance.$el);
    }
    AlertInstance.message = message;
    AlertInstance.okLabel = options && options.okLabel ? options.okLabel : undefined;
    AlertInstance.negativeLink = false;

    return new Promise((resolve, reject) => {
        let onOk: () => void = () => {
            if (AlertInstance) {
                unhook();
            }

            Vue.nextTick(() => {
                resolve();
            });
        };

        let hook: () => void = () => {
            if (AlertInstance) {
                AlertInstance.$on('ok', onOk);
                AlertInstance.$props['open'] = true;
            }
        };

        let unhook: () => void = () => {
            if (AlertInstance) {
                AlertInstance.$off('ok', onOk);
                AlertInstance.$props['open'] = false;
            }
        };

        if (AlertInstance) {
            AlertInstance.$nextTick(() => {
                hook();
            });
        } else {
            console.error('No instance of modal dialog');
            reject();
        }
    });
};

const AlertPlugin: PluginObject<any> = {
    install(v, options): void {
        (v.prototype as any).$alert = alertFunction;
    }
};

export default AlertPlugin;
