import { boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ADD_NAME } from '../component-names';
import AddPlugin from './add';

Vue.use(AddPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${ADD_NAME}`, module)


    .add('default', () => ({
        template: '<m-add></m-add>'
    }))
    .add('disabled', () => ({
        template: '<m-add :disabled="true">item</m-add>'
    }))
    .add('underline', () => ({
        props: {
            isUnderline: {
                default: boolean('Toggle underline', false)
            }
        },
        template: '<m-add :underline="isUnderline">item</m-add>'
    }))
    .add('icon-size', () => ({
        props: {
            iconSize: {
                default: number('Icon size in px', 60)
            }
        },
        template: '<m-add :icon-size="iconSize + \'px\'">item</m-add>'
    }))
    .add('icon-position-left', () => ({
        template: '<m-add icon-position="left">item</m-add>'
    }))
    .add('icon-position-right', () => ({
        template: '<m-add icon-position="right">item</m-add>'
    }));
storiesOf(`${componentsHierarchyRootSeparator}${ADD_NAME}/skin`, module)
    .add('default', () => ({
        template: '<m-add skin="default">item</m-add>'
    }))
    .add('light', () => ({
        template: '<div style="background-color:gray; margin:0;"><m-add skin="light">item</m-add></div>'
    }))
    .add('text', () => ({
        template: '<m-add skin="text">item</m-add>'
    }));

