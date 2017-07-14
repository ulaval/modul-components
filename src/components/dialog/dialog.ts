import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from '../../mixins/dialog-template/dialog-template.html?style=../../mixins/dialog-template/dialog-template.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import { DialogTemplate, DialogTemplateMixin } from '../../mixins/dialog-template/dialog-template';

const MODE_PRIMARY = 'primary';
const MODE_SECONDARY = 'secondary';
const MODE_PANEL = 'panel';

const TRANSITION_DURATION = 300;
const TRANSITION_DURATION_LONG = 600;

@WithRender
@Component({
    mixins: [DialogTemplate]
})
export class MDialog extends Vue implements DialogTemplateMixin {
    @Prop({ default: MODE_PRIMARY })
    public mode: string;
    public componentName: string = DIALOG_NAME;
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
