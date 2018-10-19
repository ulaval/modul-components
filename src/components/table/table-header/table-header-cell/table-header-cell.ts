import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../../../utils/vue/vue';
import { TABLE_HEADER_CELL_NAME } from '../../../component-names';
import WithRender from './table-header-cell.html';

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
