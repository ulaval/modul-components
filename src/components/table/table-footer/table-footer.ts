import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_FOOTER_NAME } from '../../component-names';
import WithRender from './table-footer.html';

@WithRender
@Component
export class MTableFooter extends ModulVue {

}

const TableFooterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_FOOTER_NAME, 'plugin.install');
        v.component(TABLE_FOOTER_NAME, MTableFooter);
    }
};

export default TableFooterPlugin;
