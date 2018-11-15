import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { BACK_NAME } from '../component-names';
import WithRender from './back.sandbox.html';

@WithRender
@Component
export class MBackSandbox extends ModulVue {
    private alert(): void {
        alert('BACK - Test!');
    }
}

const BackSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${BACK_NAME}-sandbox`, MBackSandbox);
    }
};

export default BackSandboxPlugin;
