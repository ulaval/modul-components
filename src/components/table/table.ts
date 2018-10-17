import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TABLE_NAME } from '../component-names';
import WithRender from './table.html?style=./table.scss';
import TableHeaderCellPlugin from './table-header-cell/table-header-cell';
import TableBodyCellPlugin from './table-body-cell/table-body-cell';
import TableFooterCellPlugin from './table-footer-cell/table-footer-cell';

@WithRender
@Component
export class MTable extends ModulVue {

    @Prop({ default: () => [] })
    data: any[];

    @Prop({ default: 50 })
    maxRows: number;

    private rows: number = 0;

    public getDataValue(row: number): any {
        return this.data[row - 1];
    }

    public get hasHeader(): boolean {
        return !!this.$slots['table-header'];
    }

    public get hasFooter(): boolean {
        return !!this.$slots['table-footer'];
    }

    protected created(): void {
        this.propRows = (this.data.length <= this.maxRows) ? this.data.length : this.maxRows;
    }

    public get propRows(): number {
        return this.rows;
    }

    public set propRows(rows: number) {
        this.rows = rows;
    }

}

const TablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_NAME, 'plugin.install');
        v.use(TableHeaderCellPlugin);
        v.use(TableBodyCellPlugin);
        v.use(TableFooterCellPlugin);
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
