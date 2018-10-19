import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_ROW_NAME } from '../../component-names';
import WithRender from './table-row.html';

@WithRender
@Component
export class MTableRow extends ModulVue {

}

const TableRowPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_ROW_NAME, 'plugin.install');
        v.component(TABLE_ROW_NAME, MTableRow);
    }
};

export default TableRowPlugin;
