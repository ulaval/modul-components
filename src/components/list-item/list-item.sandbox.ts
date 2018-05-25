import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { LIST_ITEM_NAME } from '../component-names';
import WithRender from './list-item.sandbox.html';

@WithRender
@Component
export class MListItemSandbox extends Vue {
}

const ListItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${LIST_ITEM_NAME}-sandbox`, MListItemSandbox);
    }
};

export default ListItemSandboxPlugin;
