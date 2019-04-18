import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import ButtonPlugin from '../button/button';
import CheckboxPlugin from '../checkbox/checkbox';
import { TABLE_NAME } from '../component-names';
import OptionPlugin from '../option/option';
import TablePlugin, { MColumnSortDirection, MColumnTable } from './table';
import WithRender from './table.sandbox.html?style=./table.sandbox.scss';

@WithRender
@Component
export class MTableSandbox extends Vue {

    simpleColumns: MColumnTable[] = [
        {
            id: 'name',
            title: 'Name',
            dataProp: 'name',
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'age',
            title: 'Age',
            dataProp: 'age',
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'username',
            title: 'Username',
            dataProp: 'username',
            sortDirection: MColumnSortDirection.None
        }
    ];

    columns: MColumnTable[] = [
        {
            id: 'check',
            title: '',
            dataProp: 'check',
            width: '16px',
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'name',
            title: 'Name',
            dataProp: 'name',
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'age',
            title: 'Age',
            dataProp: 'age',
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'username',
            title: 'Username',
            dataProp: 'username',
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'menu',
            title: '',
            dataProp: 'menu',
            width: '33px',
            sortDirection: MColumnSortDirection.None
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

    sortableColumns: MColumnTable[] = [
        {
            id: 'name',
            title: 'Name',
            dataProp: 'name',
            sortable: true,
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'age',
            title: 'Age',
            dataProp: 'age',
            sortable: true,
            sortDirection: MColumnSortDirection.None
        },
        {
            id: 'username',
            title: 'Username',
            dataProp: 'username',
            sortable: false,
            sortDirection: MColumnSortDirection.None
        }
    ];

    loading: boolean = false;

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

    onSortApplied(column: MColumnTable): void {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.$log.log(`Tri: dataProp: ${column.dataProp} - sortDirection: ${column.sortDirection}`);
        }, 700);
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
