import { PluginObject } from 'vue';

import WithRender from './table-body-cell.html';
import { ModulVue } from '../../../utils/vue/vue';
import Component from 'vue-class-component';
import { TABLE_BODY_CELL_NAME } from '../../component-names';

@WithRender
@Component
export class MTableBodyCell extends ModulVue {

}

const TableBodyCellPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_BODY_CELL_NAME, 'plugin.install');
        v.component(TABLE_BODY_CELL_NAME, MTableBodyCell);
    }
};

export default TableBodyCellPlugin;
