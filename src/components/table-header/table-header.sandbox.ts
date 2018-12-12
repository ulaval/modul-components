import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { TABLE_HEADER_NAME } from '../component-names';
import WithRender from './table-header.sandbox.html';

@WithRender
@Component
export class MTableHeaderSandbox extends Vue {
}

const TableHeaderSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TABLE_HEADER_NAME}-sandbox`, MTableHeaderSandbox);
    }
};

export default TableHeaderSandboxPlugin;
