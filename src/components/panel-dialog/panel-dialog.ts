import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { PANEL_DIALOG_NAME } from '../component-names';
import { DialogTemplate, DialogMode } from '../../mixins/dialog-template/dialog-template';

@Component({
    mixins: [DialogTemplate]
})
export class MPanelDialog extends DialogTemplate {
    public componentName: string = PANEL_DIALOG_NAME;

    protected get propMode(): DialogMode {
        return DialogMode.Panel;
    }
}

const PanelDialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_DIALOG_NAME, MPanelDialog);
    }
};

export default PanelDialogPlugin;
