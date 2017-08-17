import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { DIALOG_NAME } from '../component-names';
import { BaseWindow, BaseWindowMode } from '../../mixins/base-window/base-window';

const DIALOG_ID: string = 'mDialog';

@Component({
    mixins: [BaseWindow]
})
export class MDialog extends ModulVue {
    public componentName: string = DIALOG_NAME;

    protected get windowMode(): BaseWindowMode {
        return BaseWindowMode.Dialog;
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
