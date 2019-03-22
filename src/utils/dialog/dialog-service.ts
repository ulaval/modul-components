import Vue from 'vue';
import { PluginObject } from 'vue/types/plugin';
import { MDialogWidth, MDialogState, MDialog } from '../../components/dialog/dialog';

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
}

export class DialogService {

    public createDialogInstance(params: DialogParams): MDialog {
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

        return dialog;
    }

    private createAlert(params: DialogParams): void {
    }

    private createConfirm(params: DialogParams): void {
    }

    private createDialog(params: DialogParams): void {
    }
}

const DialogServicePlugin: PluginObject<any> = {
    install(v): void {
        let dialog: DialogService = new DialogService();
        (v.prototype).$dialog = dialog;
    }
};

export default DialogServicePlugin;
