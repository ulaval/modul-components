import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from '../../mixins/dialog-props/dialog-template.html';
import { PANEL_DIALOG_NAME } from '../component-names';
import { DialogProps } from '../../mixins/dialog-props/dialog-props';

@WithRender
@Component({
    mixins: [DialogProps]
})
export class MPanelDialog extends Vue {
    @Prop({ default: false })
    public title: string;
    public componentName: string = PANEL_DIALOG_NAME;
    private mode = 'panel';
}

const PanelDialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(PANEL_DIALOG_NAME, MPanelDialog);
    }
};

export default PanelDialogPlugin;
