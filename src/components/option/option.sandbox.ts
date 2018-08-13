import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { OPTION_NAME } from '../component-names';
import WithRender from './option.sandbox.html';

@WithRender
@Component
export class MOptionSandbox extends ModulVue {
    private doAdd(): void {
        alert('Add clicked');
    }
}

const OptionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${OPTION_NAME}-sandbox`, MOptionSandbox);
    }
};

export default OptionSandboxPlugin;
