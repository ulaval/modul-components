import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { TABLE_NAME } from '../component-names';
import TablePlugin from './table';
import TableBodyPlugin from './table-body/table-body';
import TableCellPlugin from './table-cell/table-cell';
import TableEmptyPlugin from './table-empty/table-empty';
import TableFooterPlugin from './table-footer/table-footer';
import TableHeaderPlugin from './table-header/table-header';
import TableHeaderCellPlugin from './table-header/table-header-cell/table-header-cell';
import TableRowPlugin from './table-row/table-row';
import WithRender from './table.sandbox.html?style=./table.sandbox.scss';

@WithRender
@Component
export class MTableSandbox extends Vue {

    data: any[] = [
        {
            id: '1',
            name: 'Jonathan',
            age: '25',
            username: 'jonathan.25'
        },
        {
            id: '2',
            name: 'Carl',
            age: '30',
            username: 'carl.30'
        },
        {
            id: '3',
            name: 'Jacob',
            age: '26',
            username: 'jacob.26'
        },
        {
            id: '4',
            name: 'Vincent',
            age: '34',
            username: 'vincent.34'
        },
        {
            id: '5',
            name: 'Manon',
            age: '28',
            username: 'manon.28'
        },
        {
            id: '6',
            name: 'Michael',
            age: '16',
            username: 'michael.16'
        }

    ];

    dataIncomplete: any[] = [
        {
            id: '1',
            name: 'Jonathan',
            age: '25'
        },
        {
            id: '2',
            name: 'Carl',
            username: 'carl.30'
        },
        {
            id: '3',
            age: '26',
            username: 'jacob.26'
        },
        {
            name: 'Vincent',
            age: '34',
            username: 'vincent.34'
        }

    ];

    emptyData: any[] = [];

    editData(id: string): void {
        console.error('Edit data: ' + id);
    }

    deleteData(id: string): void {
        console.error('Delete data: ' + id);
    }

    showMore(): void {
        console.error('Show more');
    }
}

const TableSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TableBodyPlugin);
        v.use(TableCellPlugin);
        v.use(TableEmptyPlugin);
        v.use(TableFooterPlugin);
        v.use(TableHeaderCellPlugin);
        v.use(TableHeaderPlugin);
        v.use(TableRowPlugin);
        v.use(TablePlugin);
        v.component(`${TABLE_NAME}-sandbox`, MTableSandbox);
    }
};

export default TableSandboxPlugin;
