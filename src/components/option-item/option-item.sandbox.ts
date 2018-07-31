import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { OPTION_ITEM_NAME } from '../component-names';
import WithRender from './option-item.sandbox.html';

@WithRender
@Component
export class MOptiontemSandbox extends Vue {
}

const OptionItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${OPTION_ITEM_NAME}-sandbox`, MOptiontemSandbox);
    }
};

export default OptionItemSandboxPlugin;
