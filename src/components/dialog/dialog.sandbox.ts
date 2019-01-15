import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { DIALOG_NAME } from '../component-names';
import { MDialogWidth } from './dialog';
import WithRender from './dialog.sandbox.html';


@WithRender
@Component
export class MDialogSandbox extends Vue {
    dialogWidth: MDialogWidth = MDialogWidth.Default;
}

const DialogSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DIALOG_NAME}-sandbox`, MDialogSandbox);
    }
};

export default DialogSandboxPlugin;
