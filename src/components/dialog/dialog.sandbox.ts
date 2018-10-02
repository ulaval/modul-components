import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DIALOG_NAME } from '../component-names';
import DialogPlugin, { MDialog } from './dialog';
import WithRender from './dialog.sandbox.html';

@WithRender
@Component
export class MDialogSandbox extends Vue {
    $refs: {
        dialogKeyDownParent: MDialog;
        dialogKeyDownEnfant: MDialog;
    };

    public cancel(n: number): void {
        if (n === 1) {
            this.$refs.dialogKeyDownParent.closeDialog();
        } else if (n === 2) {
            this.$refs.dialogKeyDownEnfant.closeDialog();
            this.$nextTick(() => {
                this.$refs.dialogKeyDownParent.focus();
            });
        }
    }
}

const DialogSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DialogPlugin);
        v.component(`${DIALOG_NAME}-sandbox`, MDialogSandbox);
    }
};

export default DialogSandboxPlugin;
