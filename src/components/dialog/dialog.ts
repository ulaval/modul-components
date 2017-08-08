import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { DIALOG_NAME } from '../component-names';
import { DialogTemplate, DialogMode } from '../../mixins/dialog-template/dialog-template';

const DIALOG_ID: string = 'mDialog';

@Component({
    mixins: [DialogTemplate]
})
export class MDialog extends Vue {
    public componentName: string = DIALOG_NAME;
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
