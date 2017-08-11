import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { DIALOG_NAME } from '../component-names';
import { DialogTemplate, DialogMode } from '../../mixins/base-window/base-window';

const DIALOG_ID: string = 'mDialog';

@Component({
    mixins: [DialogTemplate]
})
export class MDialog extends ModulVue {
    public componentName: string = DIALOG_NAME;

    protected get dialogMode(): DialogMode {
        return DialogMode.Dialog;
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
