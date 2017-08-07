import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { SECONDARY_DIALOG_NAME } from '../component-names';
import { DialogTemplate, DialogMode } from '../../mixins/dialog-template/dialog-template';

@Component({
    mixins: [DialogTemplate]
})
export class MSecondaryDialog extends DialogTemplate {
    public componentName: string = SECONDARY_DIALOG_NAME;

    protected get propMode(): DialogMode {
        return DialogMode.Secondary;
    }
}

const SecondaryDialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SECONDARY_DIALOG_NAME, MSecondaryDialog);
    }
};

export default SecondaryDialogPlugin;
