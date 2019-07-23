import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TABLE_NAME } from '../component-names';
import TablePlugin, { MColumnTable } from './table';
Vue.use(TablePlugin);



storiesOf(`${componentsHierarchyRootSeparator}${TABLE_NAME}`, module)
    .add('Default', () => ({
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' }
                ]
            },
            rows: {
                default: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' },
                    { id: '5', name: 'Manon', age: '28', username: 'manon.28' }
                ]
            }
        },
        template: '<m-table :columns="columns" :rows="rows" width="100%"></m-table>'
    }))
    .add('Custom Header', () => ({
        props: {
            columns: {
                default: [
                    { id: 'check', title: '', dataProp: 'check', width: '16px' },
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' },
                    { id: 'menu', title: '', dataProp: 'menu', width: '33px' }
                ]
            },
            rows: {
                default: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' },
                    { id: '5', name: 'Manon', age: '28', username: 'manon.34' }
                ]
            }
        },
        template: `<m-table :columns="columns" :rows="rows" width="100%">
                        <thead slot="header">
                            <tr>
                                <th colspan="2">NAME, USERNAME</th>
                                <th>AGE</th>
                            </tr>
                        </thead>

                        <tbody slot="body">
                            <tr v-for="(row, index) in rows"
                                :key="index">
                                <td colspan="2">{{ row.name }} - {{ row.username }}</td>
                                <td>{{ row.age }}</td>
                            </tr>
                        </tbody>
                   </m-table>`
    }))
    .add('Custom cell', () => ({
        props: {
            columns: {
                default: [
                    { id: 'check', title: '', dataProp: 'check', width: '16px' },
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' },
                    { id: 'menu', title: '', dataProp: 'menu', width: '33px' }
                ]
            },
            rows: {
                default: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' },
                    { id: '5', name: 'Manon', age: '28', username: 'manon.28' }
                ]
            }
        },
        template: `<m-table :columns="columns" :rows="rows" width="100%">
                        <template slot="header.age"> AGE </template>
                        <template slot="body.age" slot-scope="{data}"> {{ data.age }} ans </template>
                        <template slot="body.check" slot-scope="{data}">
                            <m-checkbox></m-checkbox>
                        </template>
                        <template slot="body.menu" slot-scope="{data}">
                            <m-option size="33px">
                                <m-option-item-edit"></m-option-item-edit>
                                <m-option-item-delete"></m-option-item-delete>
                            </m-option>
                        </template>
                        <template slot="footer">
                            <td class="m-table-sandbox__show-more" colspan="4" style="text-align: center;">
                                <m-button class="m-table-sandbox__show-more-button">
                                    <p class="m-u--no-margin">Show more results</p>
                                    <span>1-5 of 45</span>
                                </m-button>
                            </td>
                        </template>
                   </m-table>`
    }))
    .add('Custom row', () => ({
        props: {
            columns: {
                default: [
                    { id: 'check', title: '', dataProp: 'check', width: '16px' },
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' },
                    { id: 'menu', title: '', dataProp: 'menu', width: '33px' }
                ]
            },
            rows: {
                default: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' },
                    { id: '5', name: 'Manon', age: '28', username: 'manon.28' }
                ]
            }
        },
        template: `<m-table :columns="columns" :rows="rows" width="100%">
                        <template slot="row" slot-scope="{data}">
                            <td> </td>
                            <td> {{ data.name }}</td>
                            <td colspan="2">
                                {{ data.age }} ans - {{ data.username }}
                            </td>
                            <td>
                                <m-option size="33px">
                                    <m-option-item-edit></m-option-item-edit>
                                    <m-option-item-delete></m-option-item-delete>
                                </m-option>
                            </td>
                        </template>
                        <template slot="footer">
                            <td class="m-table-sandbox__show-more" colspan="4" style="text-align: center;">
                                <m-button class="m-table-sandbox__show-more-button">
                                    <p class="m-u--no-margin">Show more results</p>
                                    <span>1-5 of 45</span>
                                </m-button>
                            </td>
                        </template>
                   </m-table>`
    }))
    .add('Centered', () => ({
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name', dataProp: 'name', centered: true },
                    { id: 'age', title: 'Age', dataProp: 'age', centered: true },
                    { id: 'username', title: 'Username', dataProp: 'username', centered: true }
                ]
            },
            rows: {
                default: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' },
                    { id: '5', name: 'Manon', age: '28', username: 'manon.28' }
                ]
            }
        },
        template: '<m-table :columns="columns" :rows="rows" width="100%"></m-table>'
    }))
    .add('Empty table - default slot', () => ({
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' }
                ]
            },
            rows: {
                default: []
            }
        },
        template: '<m-table :columns="columns" :rows="rows" width="100%"></m-table>'
    }))
    .add('Empty table - custom slot', () => ({
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' }
                ]
            },
            rows: {
                default: []
            }
        },
        template: `<m-table :columns="columns" :rows="emptyRows" width="100%">
                        <template slot="empty">
                            <td class="m-table-sandbox__empty__cell"
                                :colspan="columns.length">
                                Empty table
                            </td>
                        </template>
                    </m-table>`
    }))
    .add('Loading', () => ({
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age' },
                    { id: 'username', title: 'Username', dataProp: 'username' }
                ]
            },
            rows: {
                default: []
            }
        },
        template: `<m-table :columns="columns" :rows="emptyRows" :loading="true" width="100%"></m-table>`
    }))
    .add('Sortable', () => ({
        data: function(): any {
            return {
                rows: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' },
                    { id: '5', name: 'Manon', age: '28', username: 'manon.28' }
                ]
            };
        },
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name', dataProp: 'name', sortable: true },
                    { id: 'age', title: 'Age', dataProp: 'age', sortable: true },
                    { id: 'username', title: 'Username', dataProp: 'username', sortable: true }
                ]
            }
        },
        template: '<m-table :columns="columns" :rows="rows" width="100%" @sortApplied="onSortApplied($event)"></m-table>',
        methods: {
            onSortApplied(columnTable: MColumnTable): void {
                this.$data.rows.sort((a, b) => {
                    if (a[columnTable.dataProp] < b[columnTable.dataProp]) {
                        return -1 * columnTable.sortDirection!;
                    } else if (a[columnTable.dataProp] > b[columnTable.dataProp]) {
                        return 1 * columnTable.sortDirection!;
                    }
                    return 0;
                });
            }
        }
    }))
    .add('skin="simple"', () => ({
        props: {
            columns: {
                default: [
                    { id: 'name', title: 'Name, Username', dataProp: 'name' },
                    { id: 'age', title: 'Age', dataProp: 'age', width: '80px' }
                ]
            },
            rows: {
                default: [
                    { id: '1', name: 'Jonathan', age: '25', username: 'jonathan.25' },
                    { id: '2', name: 'Carl', age: '30', username: 'carl.30' },
                    { id: '3', name: 'Jacob', age: '26', username: 'jacob.26' },
                    { id: '4', name: 'Vincent', age: '34', username: 'vincent.34' }
                ]
            }
        },
        template: `<m-table skin="simple" :columns="columns" width="100%">
                    <tbody slot="body">
                        <tr v-for="(row, index) in rows"
                            :key="index">
                            <td>{{ row.name }} - {{ row.username }}</td>
                            <td>{{ row.age }}</td>
                        </tr>
                    </tbody>
                </m-table>`
    }));
