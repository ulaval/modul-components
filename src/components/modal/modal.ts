import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { MODAL_NAME } from '../component-names';
import { DialogTemplate, DialogMode } from '../../mixins/dialog-template/dialog-template';

@Component({
    mixins: [DialogTemplate]
})
export class MModal extends ModulVue {
    public componentName: string = MODAL_NAME;

    protected get propMode(): DialogMode {
        return DialogMode.Modal;
    }
}

const ModalPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
