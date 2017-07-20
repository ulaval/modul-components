import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from '../../mixins/dialog-template/dialog-template.html';
import { SECONDARY_DIALOG_NAME } from '../component-names';
import { DialogTemplate, DialogTemplateMixin } from '../../mixins/dialog-template/dialog-template';

@WithRender
@Component({
    mixins: [DialogTemplate]
})
export class MSecondaryDialog extends Vue implements DialogTemplateMixin {
    public mode: string = 'secondary';
    public componentName: string = SECONDARY_DIALOG_NAME;
}

const SecondaryDialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SECONDARY_DIALOG_NAME, MSecondaryDialog);
    }
};

export default SecondaryDialogPlugin;
