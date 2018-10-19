import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_CELL_NAME } from '../../component-names';
import WithRender from './table-cell.html';

@WithRender
@Component
export class MTableCell extends ModulVue {

}

const TableCellPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_CELL_NAME, 'plugin.install');
        v.component(TABLE_CELL_NAME, MTableCell);
    }
};

export default TableCellPlugin;
