import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { CHIP_NAME } from '../component-names';
import ChipPlugin, { MChipMode } from './chip';

Vue.use(ChipPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${CHIP_NAME}`, module)


    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'Default chip')
            }
        },
        methods: {
            onAdd(): void {
                alert('@Emit(\'add\')');
            },
            onClick(): void {
                alert('@Emit(\'click\')');
            }
        },
        template: '<m-chip @add="onAdd()" @click="onClick()">{{text}}</m-chip>'
    }))
    .add('disabled', () => ({
        methods: {
            onAdd(): void {
                alert('@Emit(\'add\')');
            },
            onClick(): void {
                alert('@Emit(\'click\')');
            }
        },
        template: '<m-chip disabled="true" @add="onAdd()" @click="onClick()">Disabled</m-chip>'
    }))
    .add('mode="add"', () => ({
        props: {
            mode: {
                default: text('Text', MChipMode.Add)
            }
        },
        methods: {
            onAdd(): void {
                alert('@Emit(\'add\')');
            },
            onClick(): void {
                alert('@Emit(\'click\')');
            }
        },
        template: '<m-chip :mode="mode" @add="onAdd()" @click="onClick()">Add mode</m-chip>'
    }))
    .add('mode="delete"', () => ({
        props: {
            mode: {
                default: text('Text', MChipMode.Delete)
            }
        },
        methods: {
            onDelete(): void {
                alert('@Emit(\'delete\')');
            },
            onClick(): void {
                alert('@Emit(\'click\')');
            }
        },
        template: '<m-chip :mode="mode" @delete="onDelete()" @click="onClick()">Delete mode</m-chip>'
    }));
