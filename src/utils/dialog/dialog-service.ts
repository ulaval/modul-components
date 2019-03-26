import Vue from 'vue';
import { PluginObject } from 'vue/types/plugin';
import { MDialog, MDialogState } from '../../components/dialog/dialog';


declare module 'vue/types/vue' {
    interface Vue {
        $dialog: DialogService;
    }
}

export class DialogService {

    /**
     *
     * @param message the message of the confirmation dialog
     * @param title a title label if any
     * @param okLabel a cancel label if any
     */
    public alert(message: string, title?: string, okLabel?: string): Promise<void> {
        let alertInstance: MDialog = new MDialog({
            el: document.createElement('div')
        });

        document.body.appendChild(alertInstance.$el);
        alertInstance.message = message;
        alertInstance.okLabel = okLabel ? okLabel : undefined;
        alertInstance.title = title ? title : '';
        alertInstance.negativeLink = false;

        return this.show(alertInstance);
    }


    /**
     *
     * @param message the message of the confirmation dialog
     * @param title a title label if any
     * @param okLabel a ok label if any
     * @param cancelLabel a cancel label if any
     * @param rejectOnCancel if true, the promise will be rejected on cancel
     */
    public confirm(message: string, title?: string, okLabel?: string, cancelLabel?: string, rejectOnCancel?: boolean): Promise<void> {
        let confirmInstance: MDialog = new MDialog({
            el: document.createElement('div')
        });

        document.body.appendChild(confirmInstance.$el);
        confirmInstance.message = message;
        confirmInstance.type = MDialogState.Confirmation;
        confirmInstance.title = title ? title : '';
        confirmInstance.okLabel = okLabel ? okLabel : undefined;
        confirmInstance.cancelLabel = cancelLabel ? cancelLabel : undefined;

        return this.show(confirmInstance, rejectOnCancel);
    }


    /**
     *
     * @param mDialogInstance the MDialog instance
     * @param rejectOnCancel if true, the promise will be rejected on cancel
     */
    public show(mDialogInstance: MDialog, rejectOnCancel?: boolean): Promise<void> {
        return new Promise((resolve, reject) => {

            let onOk: () => void = () => {
                if (mDialogInstance) {
                    unhook();
                }

                Vue.nextTick(() => {
                    resolve();
                });
            };

            let onCancel: () => void = () => {
                if (mDialogInstance) {
                    unhook();
                }
                if (rejectOnCancel) {
                    reject();
                }
            };

            let hook: () => void = () => {
                if (mDialogInstance) {
                    mDialogInstance.$on('ok', onOk);
                    mDialogInstance.$on('cancel', onCancel);
                    mDialogInstance.openDialog();

                }
            };

            let unhook: () => void = () => {
                if (mDialogInstance) {
                    mDialogInstance.$off('ok', onOk);
                    mDialogInstance.$off('cancel', onCancel);
                }
            };

            if (mDialogInstance) {
                mDialogInstance.$nextTick(() => {
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
        (v.prototype).$dialog = dialog;
    }
};

export default DialogServicePlugin;
