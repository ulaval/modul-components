import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { POPPER_NAME } from '../component-names';
import WithRender from './popper.sandbox.html';

@WithRender
@Component
export class MPopperSandbox extends Vue {
}

const PopperSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${POPPER_NAME}-sandbox`, MPopperSandbox);
    }
};

export default PopperSandboxPlugin;
