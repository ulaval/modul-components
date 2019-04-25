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

export enum MColumnSortDirection {
    None = 0,
    Asc = 1,
    Dsc = -1
}

export interface MColumnTable {
    id: string;
    title: string;
    dataProp: string;
    width?: string;
    sortable?: boolean;
    sortDirection?: MColumnSortDirection;
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

    i18nEmptyTable: string = this.$i18n.translate('m-table:empty-table');
    i18nLoading: string = this.$i18n.translate('m-table:loading');
    i18nPleaseWait: string = this.$i18n.translate('m-table:please-wait');

    @Emit('add')
    onAdd(): void {
    }

    @Emit('sortApplied')
    emitSortApplied(columnTable: MColumnTable): void { }

    get isEmpty(): boolean {
        return this.rows.length === 0 && !this.loading;
    }

    public sort(columnTable: MColumnTable): void {
        if (this.loading) {
            return;
        }

        if (typeof columnTable.sortDirection === 'undefined') {
            columnTable.sortDirection = MColumnSortDirection.None;
        }

        this.columns.forEach(c => {
            if (c !== columnTable) {
                c.sortDirection = MColumnSortDirection.None;
            }
        });

        switch (columnTable.sortDirection) {
            case MColumnSortDirection.None:
                columnTable.sortDirection = MColumnSortDirection.Asc;
                break;
            case MColumnSortDirection.Asc:
                columnTable.sortDirection = MColumnSortDirection.Dsc;
                break;
            case MColumnSortDirection.Dsc:
                columnTable.sortDirection = MColumnSortDirection.None;
                break;
        }

        this.emitSortApplied(columnTable);
    }

    public isColumnSorted(columnTable: MColumnTable): boolean {
        return columnTable.sortDirection === MColumnSortDirection.Asc || columnTable.sortDirection === MColumnSortDirection.Dsc;
    }

    public getIconName(columnTable: MColumnTable): string | undefined {
        if (columnTable.sortDirection === MColumnSortDirection.Dsc) {
            return 'm-svg__arrow-thin--down';
        }

        return 'm-svg__arrow-thin--up';
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
