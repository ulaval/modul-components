import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { POPUP_NAME } from '../component-names';
import WithRender from './popup.sandbox.html';

@WithRender
@Component
export class MPopupSandbox extends ModulVue {

    private onClose(): void {
        this.$log.log('$emit(\'close\') popup');
    }
}

const PopupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${POPUP_NAME}-sandbox`, MPopupSandbox);
    }
};

export default PopupSandboxPlugin;
