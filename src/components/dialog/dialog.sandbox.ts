import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { DIALOG_NAME } from '../component-names';
import DialogPlugin, { MDialog } from './dialog';
import WithRender from './dialog.sandbox.html';


@WithRender
@Component
export class MDialogSandbox extends Vue {

    $refs: {
        customDialog: MDialog;
    };

    onConfirmService(): void {

        this.$dialog.confirm('Please Confirm Me').then((result) => {
            this.$log.info('confirmed!');
        });
    }

    onCustomConfirmService(): void {

        this.$dialog.show(this.$refs.customDialog).then((result) => {
            this.$log.info('onCustomConfirmService confirmed!');
        });
    }
}

const DialogSandboxPlugin: PluginObject<any> = {



    install(v, options): void {
        v.use(DialogPlugin);
        v.component(`${DIALOG_NAME}-sandbox`, MDialogSandbox);
    }
};

export default DialogSandboxPlugin;
