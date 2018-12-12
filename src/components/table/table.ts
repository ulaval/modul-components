import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { TABLE_NAME } from '../component-names';
import WithRender from './table.html?style=./table.scss';

export enum MTableSkin {
    Regular = 'regular'
}

export interface MColumnTable {
    id: string;
    title: string;
    dataProp: string;
    width?: string;
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

    get isEmpty(): boolean {
        return this.rows.length === 0 && !this.loading;
    }

    columnWidth(col: MColumnTable): { width: string } | '' {
        return col.width ? { width: col.width } : '';
    }
}

const TablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TABLE_NAME, 'plugin.install');
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
