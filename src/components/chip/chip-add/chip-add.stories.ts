import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { CHIP_ADD_NAME } from '../../component-names';
import ChipAddPlugin from './chip-add';

Vue.use(ChipAddPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${CHIP_ADD_NAME}`, module)

    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'Chip add')
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
        template: '<m-chip-add @add="onAdd()" @click="onClick()">{{text}}</m-chip-add>'
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
        template: '<m-chip-add disabled="true" @add="onAdd()" @click="onClick()">Disabled</m-chip-add>'
    }))
    .add('icon=false', () => ({
        template: '<m-chip-add :icon="false">Chip</m-chip-add>'
    }));
