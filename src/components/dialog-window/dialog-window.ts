import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { DIALOG_NAME } from '../component-names';
import { BaseWindow, BaseWindowMode } from '../../mixins/base-window/base-window';
import { MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

const DIALOG_ID: string = 'mDialog';
const DIALOG_MAX_WIDTH: string = '640px';

export enum MDialogSize {
    FullSize = 'full-size',
    Large = 'large',
    Default = 'default',
    Small = 'small'
}

@Component({
    mixins: [BaseWindow]
})
export class MDialog extends ModulVue {
    @Prop({ default: MDialogSize.Default })
    public size: string;

    public componentName: string = DIALOG_NAME;

    protected get windowMode(): BaseWindowMode {
        return BaseWindowMode.Dialog;
    }

    private get propSize(): string {
        return this.size == MDialogSize.Large || this.size == MDialogSize.Small || this.size == MDialogSize.FullSize ? this.size : MDialogSize.Default;
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
