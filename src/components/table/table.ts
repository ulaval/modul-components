import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { Enums } from '../../utils/enums/enums';
import { ModulVue } from '../../utils/vue/vue';
import { TABLE_NAME } from '../component-names';
import ProgressPlugin from '../progress/progress';
import WithRender from './table.html?style=./table.scss';


export enum MTableSkin {
    Regular = 'regular',
    Simple = 'simple'
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
    centered?: boolean;
    class?: string;
    sortDirection?: MColumnSortDirection;
}

@WithRender
@Component
export class MTable extends ModulVue {

    @Prop({
        default: MTableSkin.Regular,
        validator: value => Enums.toValueArray(MTableSkin).includes(value)
    })
    public skin: MTableSkin;

    @Prop({ default: () => [] })
    public columns: MColumnTable[];

    @Prop({ default: () => [] })
    public rows: any[];

    @Prop({ default: false })
    public loading: boolean;

    @Prop({ default: true })
    public rowHighlightedOnHover: boolean;

    public i18nEmptyTable: string = this.$i18n.translate('m-table:no-data');
    public i18nLoading: string = this.$i18n.translate('m-table:loading');
    public i18nPleaseWait: string = this.$i18n.translate('m-table:please-wait');
    public i18nSort: string = this.$i18n.translate('m-table:sort');

    @Emit('add')
    private onAdd(): void {
    }

    @Emit('sortApplied')
    private emitSortApplied(columnTable: MColumnTable): void { }

    public get isEmpty(): boolean {
        return this.rows.length === 0 && !this.loading;
    }

    public sort(columnTable: MColumnTable): void {
        if (this.loading || !columnTable.sortable) {
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

    public getColumnSortDirectionClass(columnTable: MColumnTable): string | undefined {
        switch (columnTable.sortDirection) {
            case MColumnSortDirection.Asc:
                return 'm--is-sort-asc';
            case MColumnSortDirection.Dsc:
                return 'm--is-sort-desc';
            default:
                return undefined;
        }
    }

    public columnWidth(col: MColumnTable): { width: string } | '' {
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
