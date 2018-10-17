import { PluginObject } from 'vue';

import WithRender from './table-header-cell.html';
import { ModulVue } from '../../../utils/vue/vue';
import Component from 'vue-class-component';
import { TABLE_HEADER_CELL_NAME } from '../../component-names';

@WithRender
@Component
export class MTableHeaderCell extends ModulVue {

}

const TableHeaderCellPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_HEADER_CELL_NAME, 'plugin.install');
        v.component(TABLE_HEADER_CELL_NAME, MTableHeaderCell);
    }
};

export default TableHeaderCellPlugin;
