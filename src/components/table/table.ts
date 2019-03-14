import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { TABLE_NAME } from '../component-names';
import ProgressPlugin from '../progress/progress';
import WithRender from './table.html?style=./table.scss';


export enum MTableSkin {
    Regular = 'regular'
}

export interface MColumnTable {
    id: string;
    title: string;
    dataProp: string;
    width?: string;
    sortable?: boolean;
}

export class MSortedColumn {
    dataProp: string;
    ascending: boolean;
}

@WithRender
@Component
export class MTable extends ModulVue {

    @Prop({
        default: MTableSkin.Regular,
        validator: value =>
            value === MTableSkin.Regular
    })
    skin: MTableSkin;

    @Prop({ default: () => [] })
    columns: MColumnTable[];

    @Prop({ default: () => [] })
    rows: any[];

    @Prop({ default: false })
    loading: boolean;

    @Prop({ default: undefined })
    sortedColumn: MSortedColumn | undefined;

    i18nEmptyTable: string = this.$i18n.translate('m-table:empty-table');
    i18nLoading: string = this.$i18n.translate('m-table:loading');
    i18nPleaseWait: string = this.$i18n.translate('m-table:please-wait');

    @Emit('add')
    onAdd(): void {
    }

    get isEmpty(): boolean {
        return this.rows.length === 0 && !this.loading;
    }

    public sort(columnTable: MColumnTable): void {
        if (!this.loading) {
            let sortedColumn: MSortedColumn = new MSortedColumn();
            sortedColumn.dataProp = columnTable.dataProp;
            sortedColumn.ascending = !this.sortedColumn || columnTable.dataProp !== this.sortedColumn.dataProp || !this.sortedColumn.ascending;
            this.$emit('update:sortedColumn', sortedColumn);
        }
    }

    public isColumnSorted(columnTable: MColumnTable): boolean {
        if (this.sortedColumn) {
            return columnTable.dataProp === this.sortedColumn.dataProp;
        } else {
            return false;
        }
    }

    public getIconName(columnTable: MColumnTable): string {
        return !this.sortedColumn || columnTable.dataProp !== this.sortedColumn.dataProp || this.sortedColumn.ascending ? 'm-svg__arrow-thin--up' : 'm-svg__arrow-thin--down';
    }

    columnWidth(col: MColumnTable): { width: string } | '' {
        return col.width ? { width: col.width } : '';
    }
}

const TablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ProgressPlugin);
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
