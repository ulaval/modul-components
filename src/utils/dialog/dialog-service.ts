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
    public alert(message: string, title?: string, okLabel?: string): Promise<boolean> {
        let alertInstance: MDialog = new MDialog({
            el: document.createElement('div')
        });

        document.body.appendChild(alertInstance.$el);
        alertInstance.message = message;
        alertInstance.okLabel = okLabel ? okLabel : undefined;
        alertInstance.title = title ? title : '';
        alertInstance.negativeLink = false;

        return this.show(alertInstance).then((result) => {
            alertInstance.$destroy();
            return result;
        });
    }


    /**
     *
     * @param message the message of the confirmation dialog
     * @param title a title label if any
     * @param okLabel a ok label if any
     * @param cancelLabel a cancel label if any
     */
    public confirm(message: string, title?: string, okLabel?: string, cancelLabel?: string): Promise<boolean> {
        let confirmInstance: MDialog = new MDialog({
            el: document.createElement('div')
        });

        document.body.appendChild(confirmInstance.$el);
        confirmInstance.message = message;
        confirmInstance.state = MDialogState.Confirmation;
        confirmInstance.title = title ? title : '';
        confirmInstance.okLabel = okLabel ? okLabel : undefined;
        confirmInstance.cancelLabel = cancelLabel ? cancelLabel : undefined;

        return this.show(confirmInstance).then((result) => {
            confirmInstance.$destroy();
            return result;
        });
    }


    /**
     *
     * @param mDialogInstance the MDialog instance
     * @param rejectOnCancel if true, the promise will be rejected on cancel
     */
    public show(mDialogInstance: MDialog, rejectOnCancel?: boolean): Promise<boolean> {
        return new Promise((resolve, reject) => {

            let onOk: () => void = () => {
                if (mDialogInstance) {
                    unhook();
                }

                Vue.nextTick(() => {
                    resolve(true);
                });
            };

            let onCancel: () => void = () => {
                if (mDialogInstance) {
                    unhook();
                }

                Vue.nextTick(() => {
                    resolve(false);
                });
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
