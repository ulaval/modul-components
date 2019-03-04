import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { MInputMask } from './input-mask';
import WithRender from './input-mask.sandbox.html';




@WithRender
@WithRender
@Component({
    components: {
        MInputMask
    }
})
export class MInputMaskSandbox extends Vue {

    public ccModel: string = '';



}



const InputMaskSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-input-mask-sandbox`, MInputMaskSandbox);
    }
};

export default InputMaskSandboxPlugin;
