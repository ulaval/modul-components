import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from '../../mixins/dialog-template/dialog-template.html';
import { PANEL_DIALOG_NAME } from '../component-names';
import { DialogTemplate, DialogTemplateMixin } from '../../mixins/dialog-template/dialog-template';

@WithRender
@Component({
    mixins: [DialogTemplate]
})
export class MPanelDialog extends Vue implements DialogTemplateMixin {
    public mode = 'panel';
    public componentName: string = PANEL_DIALOG_NAME;
}

const PanelDialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_DIALOG_NAME, MPanelDialog);
    }
};

export default PanelDialogPlugin;
