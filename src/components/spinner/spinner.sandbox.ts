import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { SPINNER_NAME } from '../component-names';
import WithRender from './spinner.sandbox.html';

@WithRender
@Component
export class MSpinnerSandbox extends Vue {
}

const SpinnerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SPINNER_NAME}-sandbox`, MSpinnerSandbox);
    }
};

export default SpinnerSandboxPlugin;
