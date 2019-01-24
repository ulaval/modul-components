import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { POPUP_NAME } from '../component-names';
import WithRender from './popup.sandbox.html';
import PopupPlugin from './popup';
import OverlayPlugin from '../overlay/overlay';
import ButtonPlugin from '../button/button';

@WithRender
@Component
export class MPopupSandbox extends Vue {
}

const PopupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(OverlayPlugin);
        v.use(ButtonPlugin);
        v.use(PopupPlugin);
        v.component(`${POPUP_NAME}-sandbox`, MPopupSandbox);
    }
};

export default PopupSandboxPlugin;
