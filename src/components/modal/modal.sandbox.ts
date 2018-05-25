import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { MODAL_NAME } from '../component-names';
import WithRender from './modal.sandbox.html';

@WithRender
@Component
export class MModalSandbox extends Vue {
}

const ModalSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${MODAL_NAME}-sandbox`, MModalSandbox);
    }
};

export default ModalSandboxPlugin;
