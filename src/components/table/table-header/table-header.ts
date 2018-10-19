import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_HEADER_NAME } from '../../component-names';
import WithRender from './table-header.html';

@WithRender
@Component
export class MTableHeader extends ModulVue {

}

const TableHeaderPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_HEADER_NAME, 'plugin.install');
        v.component(TABLE_HEADER_NAME, MTableHeader);
    }
};

export default TableHeaderPlugin;
