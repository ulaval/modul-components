import { withA11y } from '@storybook/addon-a11y';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { INPLACE_EDIT_NAME } from '../component-names';
import InplaceEditPlugin from './inplace-edit';

Vue.use(InplaceEditPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${INPLACE_EDIT_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        template: '<m-inplace-edit></m-inplace-edit>'
    }))
    .add('editMode', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode">
                       <span slot="readMode">{{value}}</span>
                       <m-textfield slot="editMode" label="Story #1 (editMode)" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('error', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            },
            error: {
                default: boolean('error', true)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :error="error">
                       <span slot="readMode">{{value}}</span>
                       <m-textfield slot="editMode" label="Story #2 (error)" :v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('waiting', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            },
            waiting: {
                default: boolean('waiting', true)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :waiting="waiting">
                       <span slot="readMode">{{value}}</span>
                       <m-textfield slot="editMode" label="Story #3 (waiting)" :v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('padding', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', false)
            },
            padding: {
                default: text('waiting', '17px')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :padding="padding">
                       <span slot="readMode">{{value}}</span>
                       <m-textfield slot="editMode" label="Story #4 (padding)" :v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('editModePadding', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            },
            editModePadding: {
                default: text('editModePadding', '10px')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :editModePadding="editModePadding">
                       <span slot="readMode">{{value}}</span>
                       <m-textfield slot="editMode" label="Story #5 (editModePadding)" :v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('title', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            },
            title: {
                default: text('title', 'This is a custom title')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :title="title">
                       <span slot="readMode">{{value}}</span>
                       <m-textfield slot="editMode" label="Story #6 (title)" :v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }));

