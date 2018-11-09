import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { LINK_NAME } from '../component-names';
import WithRender from './link.sandbox.html';

@WithRender
@Component
export class MLinkSandbox extends ModulVue {
    private openWindow01: boolean = false;
}

const LinkSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${LINK_NAME}-sandbox`, MLinkSandbox);
    }
};

export default LinkSandboxPlugin;
