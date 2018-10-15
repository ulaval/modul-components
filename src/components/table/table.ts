import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TABLE_NAME } from '../component-names';
import WithRender from './table.html?style=./table.scss';

export interface TableHeader {
    slot: string;
    title?: string;
    width?: string;
}

@WithRender
@Component
export class MTable extends ModulVue {

    @Prop({ default: () => [] })
    headers: TableHeader[];

    @Prop({ default: () => [] })
    data: any[];

    @Prop({ default: 50 })
    rowsMax: number;

    private rows: number = 0;

    public getWidth(header: TableHeader): { width: string } {
        return {
            width: header.width ? header.width : ''
        };
    }

    protected created(): void {
        this.propRows = (this.data.length <= this.rowsMax) ? this.data.length : this.rowsMax;
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
        v.component(TABLE_NAME, MTable);
    }
};

export default TablePlugin;
