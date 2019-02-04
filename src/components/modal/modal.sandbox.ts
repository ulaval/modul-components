import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { MODAL_NAME } from '../component-names';
import TextfieldPlugin from '../textfield/textfield';
import ModalPlugin from './modal';
import WithRender from './modal.sandbox.html';


@WithRender
@Component
export class MModalSandbox extends Vue {
}

const ModalSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(TextfieldPlugin);
        v.use(ModalPlugin);
        v.component(`${MODAL_NAME}-sandbox`, MModalSandbox);
    }
};

export default ModalSandboxPlugin;
