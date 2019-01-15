import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { MODAL_NAME } from '../component-names';
import { MModalSize } from './modal';
import WithRender from './modal.sandbox.html';


@WithRender
@Component
export class MModalSandbox extends Vue {
    modalSize: MModalSize = MModalSize.Regular;
    modalHasPadding: boolean = false;
    modalHasBodyMaxWidth: boolean = false;
    modalHasHeaderPadding: boolean = false;
    modalHasBodyPadding: boolean = false;
    modalHasFooterPadding: boolean = false;
    modalCloseOnBackdrop: boolean = false;

    get modalSizeAsArray(): any {
        return MModalSize;
    }
}

const ModalSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${MODAL_NAME}-sandbox`, MModalSandbox);
    }
};

export default ModalSandboxPlugin;
