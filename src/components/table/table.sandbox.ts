import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { TABLE_NAME } from '../component-names';
import TablePlugin, { MColumnTable } from './table';
import WithRender from './table.sandbox.html?style=./table.sandbox.scss';
import OptionPlugin from '../option/option';
import ButtonPlugin from '../button/button';
import CheckboxPlugin from '../checkbox/checkbox';

@WithRender
@Component
export class MTableSandbox extends Vue {

    simpleColumns: MColumnTable[] = [
        {
            id: 'name',
            title: 'Name',
            dataProp: 'name'
        },
        {
            id: 'age',
            title: 'Age',
            dataProp: 'age'
        },
        {
            id: 'username',
            title: 'Username',
            dataProp: 'username'
        }
    ];

    columns: MColumnTable[] = [
        {
            id: 'check',
            title: '',
            dataProp: 'check',
            width: '16px'
        },
        {
            id: 'name',
            title: 'Name',
            dataProp: 'name'
        },
        {
            id: 'age',
            title: 'Age',
            dataProp: 'age'
        },
        {
            id: 'username',
            title: 'Username',
            dataProp: 'username'
        },
        {
            id: 'menu',
            title: '',
            dataProp: 'menu',
            width: '33px'
        }
    ];

    rows: any[] = [
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
        }
    ];

    emptyRows: any[] = [];

    editData(id: string): void {
        alert('Edit data: ' + id);
    }

    deleteData(id: string): void {
        alert('Delete data: ' + id);
    }

    showMore(): void {
        alert('Show more');
    }

    onCheck(id: string): void {
        alert('Check: ' + id);
    }
}

const TableSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TablePlugin);
        v.use(OptionPlugin);
        v.use(ButtonPlugin);
        v.use(CheckboxPlugin);
        v.component(`${TABLE_NAME}-sandbox`, MTableSandbox);
    }
};

export default TableSandboxPlugin;
