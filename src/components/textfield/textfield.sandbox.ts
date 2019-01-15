import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { TEXTFIELD_NAME } from '../component-names';
import TextfieldPlugin from './textfield';
import WithRender from './textfield.sandbox.html';

@WithRender
@Component
export class MTextfieldSandbox extends Vue {
    public test4Model: string = '';
    public searchModel: string = '';
}

const TextfieldSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TextfieldPlugin);
        v.component(`${TEXTFIELD_NAME}-sandbox`, MTextfieldSandbox);
    }
};

export default TextfieldSandboxPlugin;
