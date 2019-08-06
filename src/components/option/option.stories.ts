import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { OPTION_NAME } from '../component-names';
import OptionPlugin from './option';

Vue.use(OptionPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${OPTION_NAME}`, module)

    .add('default', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>`
    }))
    .add('option-separator', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-item-add></m-option-item-add>
                       <m-option-separator></m-option-separator>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('option-title', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-title>Title 1</m-option-title>
                       <m-option-item-add></m-option-item-add>
                       <m-option-title>Title 2</m-option-title>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('option-title & separator', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-title>Title 1</m-option-title>
                       <m-option-item-add></m-option-item-add>
                       <m-option-separator></m-option-separator>
                       <m-option-title>Title 2</m-option-title>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('scroll', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option :scroll="false">
                       <m-option-title>Title 1</m-option-title>
                       <m-option-item-add></m-option-item-add>
                       <m-option-separator></m-option-separator>
                       <m-option-title>Title 2</m-option-title>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }));
