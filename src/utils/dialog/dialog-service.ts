import Vue from 'vue';
import { PluginObject } from 'vue/types/plugin';
import { MDialogWidth, MDialogState, MDialog } from '../../components/dialog/dialog';
import { AlertFunction, AlertOptions } from './alert';
import { confirmFunction, ConfirmFunction, ConfirmOptions } from './confirm';

declare module 'vue/types/vue' {
    interface Vue {
        $dialog: DialogService;
    }
}

export interface DialogParams {
    title?: string;
    message?: string;
    okLabel?: string;
    okPrecision?: string;
    secBtnLabel?: string;
    sebBtnPrecision?: string;
    cancelLabel?: string;
    negativeLink?: boolean;
    hint?: string;
    silentCancel?: boolean;
}

export type AlertFunction = (message: string, options?: DialogParams) => Promise<any>;
export type ConfirmFunction = (message: string, options?: DialogParams) => Promise<any>;

export class DialogService {

    private createAlert(params: DialogParams): void {
        let AlertInstance: MDialog | undefined = undefined;
        const alertFunction: AlertFunction = (message: string, options?: DialogParams) => {
            if (!AlertInstance) {
                AlertInstance = new MDialog({
                    el: document.createElement('div')
                });

                document.body.appendChild(AlertInstance.$el);
            }
            AlertInstance.message = message;
            AlertInstance.okLabel = options && options.okLabel ? options.okLabel : undefined;
            AlertInstance.negativeLink = false;

            this.handleEvents(AlertInstance)
        };
    }

    private createConfirm(params: DialogParams): void {
        let confirmInstance: MDialog | undefined = undefined;
        const confirmFunction: ConfirmFunction = (message: string, options?: DialogParams) => {
            if (!confirmInstance) {
                confirmInstance = new MDialog({
                    el: document.createElement('div')
                });

                document.body.appendChild(confirmInstance.$el);
            }
            confirmInstance.message = message;
            confirmInstance.okLabel = options && options.okLabel ? options.okLabel : undefined;
            confirmInstance.cancelLabel = options && options.cancelLabel ? options.cancelLabel : undefined;

            this.handleEvents(confirmInstance)
        };
    }

    private createDialog(params: DialogParams): MDialog {
        const dialog: MDialog = new MDialog({
            el: document.createElement('div'),
            propsData: {
                title: params.title,
                message: params.message,
                okLabel: params.okLabel,
                okPrecision: params.okPrecision,
                secBtnLabel: params.secBtnLabel,
                cancelLabel: params.cancelLabel,
                negativeLink: params.negativeLink,
                hint: params.hint
            }
        });

        return this.handleEvents(dialog);

    }

    public handleEvents(dialogInstance: MDialog): any {
        return new Promise((resolve, reject) => {
            let onOk: () => void = () => {
                if (dialogInstance) {
                    unhook();
                }

                Vue.nextTick(() => {
                    resolve();
                });
            };

            let onSecondaryBtn: () => void = () => {
                if (dialogInstance) {
                    unhook();
                }

                Vue.nextTick(() => {
                    resolve();
                });
            };

            let onCancel: () => void = () => {
                if (dialogInstance) {
                    unhook();
                }
                if (!(options && options.silentCancel)) {
                    reject();
                }
            };

            let hook: () => void = () => {
                if (dialogInstance) {
                    dialogInstance.$on('ok', onOk);
                    dialogInstance.$on('secondaryBtn', onSecondaryBtn);
                    dialogInstance.$on('cancel', onCancel);
                    dialogInstance.$props['open'] = true;
                }
            };

            let unhook: () => void = () => {
                if (dialogInstance) {
                    dialogInstance.$off('ok', onOk);
                    dialogInstance.$off('secondaryBtn', onSecondaryBtn);
                    dialogInstance.$off('cancel', onCancel);
                    dialogInstance.$props['open'] = false;
                }
            };

            if (dialogInstance) {
                dialogInstance.$nextTick(() => {
                    hook();
                });
            } else {
                console.error('No instance of dialog');
                reject();
            }
        });
    }

}

const DialogServicePlugin: PluginObject<any> = {
    install(v): void {
        let dialog: DialogService = new DialogService();
        (v.prototype).$dialog = this.createDialog;
        (v.prototype).$alert = this.createAlert;
        (v.prototype).$confirm = this.createConfirm;
    }
};

export default DialogServicePlugin;
