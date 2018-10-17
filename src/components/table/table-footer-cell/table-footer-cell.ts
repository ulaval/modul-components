import { PluginObject } from 'vue';

import WithRender from './table-footer-cell.html';
import { ModulVue } from '../../../utils/vue/vue';
import Component from 'vue-class-component';
import { TABLE_FOOTER_CELL_NAME } from '../../component-names';

@WithRender
@Component
export class MTableFooterCell extends ModulVue {

}

const TableFooterCellPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_FOOTER_CELL_NAME, 'plugin.install');
        v.component(TABLE_FOOTER_CELL_NAME, MTableFooterCell);
    }
};

export default TableFooterCellPlugin;
