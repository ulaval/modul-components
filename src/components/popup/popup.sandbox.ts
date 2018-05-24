import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { POPUP_NAME } from '../component-names';
import WithRender from './popup.sandbox.html';

@WithRender
@Component
export class MPopupSandbox extends Vue {
}

const PopupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${POPUP_NAME}-sandbox`, MPopupSandbox);
    }
};

export default PopupSandboxPlugin;
