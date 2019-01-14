import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { DIALOG_NAME } from '../component-names';
import DialogPlugin from './dialog';
import WithRender from './dialog.sandbox.html';


@WithRender
@Component
export class MDialogSandbox extends Vue {
}

const DialogSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DialogPlugin);
        v.component(`${DIALOG_NAME}-sandbox`, MDialogSandbox);
    }
};

export default DialogSandboxPlugin;
