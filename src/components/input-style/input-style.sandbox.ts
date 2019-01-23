import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { INPUT_STYLE_NAME } from '../component-names';
import InputStylePlugin from './input-style';
import WithRender from './input-style.sandbox.html';


@WithRender
@Component
export class MInputStyleSandbox extends Vue {
}

const InputStyleSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputStylePlugin);
        v.component(`${INPUT_STYLE_NAME}-sandbox`, MInputStyleSandbox);
    }
};

export default InputStyleSandboxPlugin;
