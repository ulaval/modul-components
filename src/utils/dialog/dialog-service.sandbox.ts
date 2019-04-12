import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import DialogPlugin, { MDialog } from '../../components/dialog/dialog';
import WithRender from './dialog-service.sandbox.html';




@WithRender
@Component
export class MDialogServiceSandbox extends Vue {

    $refs: {
        customDialog: MDialog;
    };

    onAlertService(): void {
        this.$dialog.alert('This is an alert').then((result) => {
            if (result) {
                this.$log.info('ok');
            } else {
                this.$log.info('cancelled');
            }
        });
    }

    onConfirmService(): void {

        this.$dialog.confirm('Please Confirm Me').then((result) => {
            if (result) {
                this.$log.info('confirmed!');
            } else {
                this.$log.info('cancelled');
            }

        });
    }

    onCustomConfirmService(): void {

        this.$dialog.show(this.$refs.customDialog).then((result) => {
            this.$log.info('onCustomConfirmService confirmed!');
        });
    }
}

const MDialogServicePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DialogPlugin);
        v.component(`m-dialog-service-sandbox`, MDialogServiceSandbox);
    }
};

export default MDialogServicePlugin;
