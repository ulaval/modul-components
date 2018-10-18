import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ModulVue } from '../../../utils/vue/vue';
import { TABLE_EMPTY_CELL_NAME } from '../../component-names';
import WithRender from './table-empty-cell.html';

@WithRender
@Component
export class MTableEmptyCell extends ModulVue {

    public get hasEmptySlot(): boolean {
        console.log(this.$slots.default);
        return !!this.$slots.default;
    }

}

const TableEmptyCellPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_EMPTY_CELL_NAME, 'plugin.install');
        v.component(TABLE_EMPTY_CELL_NAME, MTableEmptyCell);
    }
};

export default TableEmptyCellPlugin;
