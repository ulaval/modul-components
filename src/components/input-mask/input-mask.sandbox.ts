import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { INPUT_MASK_NAME } from '../component-names';
import InputMaskPlugin from './input-mask';
import WithRender from './input-mask.sandbox.html';



@WithRender
@Component
export class MInputMaskSandbox extends Vue {
}

const InputMaskSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputMaskPlugin);
        v.component(`${INPUT_MASK_NAME}-sandbox`, MInputMaskSandbox);
    }
};

export default InputMaskSandboxPlugin;
