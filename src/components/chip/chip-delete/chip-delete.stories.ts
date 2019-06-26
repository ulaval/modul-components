import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { CHIP_DELETE_NAME } from '../../component-names';
import ChipDeletePlugin from './chip-delete';

Vue.use(ChipDeletePlugin);



storiesOf(`${componentsHierarchyRootSeparator}${CHIP_DELETE_NAME}`, module)


    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'Chip delete')
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
        template: '<m-chip-delete @delete="onDelete()" @click="onClick()">{{text}}</m-chip-delete>'
    }))
    .add('disabled', () => ({
        methods: {
            onDelete(): void {
                alert('@Emit(\'delete\')');
            },
            onClick(): void {
                alert('@Emit(\'click\')');
            }
        },
        template: '<m-chip-delete disabled="true" @delete="onDelete()" @click="onClick()">Disabled</m-chip-delete>'
    }));
