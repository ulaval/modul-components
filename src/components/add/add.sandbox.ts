import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { ADD_NAME } from '../component-names';
import WithRender from './add.sandbox.html';

@WithRender
@Component
export class MAddSandbox extends ModulVue {
    private alert(): void {
        alert('Test!');
    }
}

const AddSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ADD_NAME}-sandbox`, MAddSandbox);
    }
};

export default AddSandboxPlugin;
