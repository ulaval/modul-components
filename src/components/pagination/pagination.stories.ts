import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { PAGINATION_NAME } from '../component-names';
import PaginationPlugin from './pagination';

Vue.use(PaginationPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${PAGINATION_NAME}`, module)
    .add('default', () => ({
        data: () => ({
            model1: 1,
            itemsTotal: 500

        }),
        template: `<m-pagination v-model="model1" :items-total="itemsTotal"></m-pagination>`
    }))
    .add('value', () => ({
        data: () => ({
            model1: 12,
            itemsTotal: 500
        }),
        template: '<m-pagination v-model="model1" :value="model1" :items-total="itemsTotal"></m-pagination>'
    }))
    .add('items-per-page="14"', () => ({
        data: () => ({
            model1: 1,
            itemsTotal: 500
        }),
        template: '<m-pagination v-model="model1" :items-per-page="14" :items-total="itemsTotal"></m-pagination>'
    }))
    .add('loading', () => ({
        data: () => ({
            model1: 1,
            itemsTotal: 500
        }),
        template: '<m-pagination v-model="model1" :loading="true" :items-total="itemsTotal"></m-pagination>'
    }));
