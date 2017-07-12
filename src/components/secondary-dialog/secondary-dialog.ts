import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from '../../mixins/dialog-props/dialog-template.html';
import { SECONDARY_DIALOG_NAME } from '../component-names';
import { DialogProps } from '../../mixins/dialog-props/dialog-props';

@WithRender
@Component({
    mixins: [DialogProps]
})
export class MSecondaryDialog extends Vue {
    @Prop({ default: false })
    public title: string;
    public componentName: string = SECONDARY_DIALOG_NAME;
    private mode = 'secondary';
}

const SecondaryDialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SECONDARY_DIALOG_NAME, MSecondaryDialog);
    }
};

export default SecondaryDialogPlugin;
