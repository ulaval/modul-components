import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { STEPPERS_ITEM_NAME } from '../component-names';
import WithRender from './steppers-item.sandbox.html';

@WithRender
@Component
export class MSteppersItemSandbox extends Vue {
}

const SteppersItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${STEPPERS_ITEM_NAME}-sandbox`, MSteppersItemSandbox);
    }
};

export default SteppersItemSandboxPlugin;
