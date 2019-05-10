import { withA11y } from '@storybook/addon-a11y';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { PAGINATION_NAME } from '../component-names';
import PaginationPlugin from './pagination';

Vue.use(PaginationPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${PAGINATION_NAME}`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        data: () => ({
            model1: 1,
            itemsTotal: 500

        }),
        template: '<m-pagination v-model="model1" :items-total="itemsTotal"></m-pagination>'
    }))
    .add('value', () => ({
        data: () => ({
            model1: 38,
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

storiesOf(`${componentsHierarchyRootSeparator}${PAGINATION_NAME}/all props`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('make your own test (knobs)', () => ({
        data: () => ({
            model1: 1
        }),
        props: {
            value: {
                default: number('value', 4)
            },
            itemsTotal: {
                default: number('value', 666)
            },
            itemsPerPage: {
                default: number('value', 25)
            },
            loading: {
                default: boolean('loading', false)
            }
        },
        template: `<m-pagination v-model="model1" :items-per-page="itemsPerPage" :items-total="itemsTotal"
                   :loading="loading" :value="value"></m-pagination>`
    }));
