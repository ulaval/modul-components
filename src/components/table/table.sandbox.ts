import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { TABLE_NAME } from '../component-names';
import WithRender from './table.sandbox.html?style=./table.sandbox.scss';
import { TableHeader } from './table';

@WithRender
@Component
export class MTableSandbox extends Vue {

    headers: TableHeader[] = [
        {
            slot: 'name',
            title: 'Name'
        },
        {
            slot: 'age',
            title: 'Age'
        },
        {
            slot: 'username',
            title: 'Username',
            width: '35%'
        },
        {
            slot: 'menu',
            width: '5%'
        }
    ];

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
}

const TableSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TABLE_NAME}-sandbox`, MTableSandbox);
    }
};

export default TableSandboxPlugin;
