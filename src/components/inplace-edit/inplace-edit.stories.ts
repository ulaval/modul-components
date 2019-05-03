import { withA11y } from '@storybook/addon-a11y';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { INPLACE_EDIT_NAME } from '../component-names';
import InplaceEditPlugin from './inplace-edit';

Vue.use(InplaceEditPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

const INPLACE_EDIT_TAGSTYLES: {} = {
    'h1': 'h1',
    'h2': 'h2',
    'h3': 'h3',
    'h4': 'h4',
    'h5': 'h5',
    'h6': 'h6',
    'h7': 'h7'
};

storiesOf(`${componentsHierarchyRootSeparator}${INPLACE_EDIT_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('readmode only', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', false)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #1 (readMode only)" v-model="value"></m-textfield>
                   </m-inplace-edit>`
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
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #2 (editMode)" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('error', () => ({
        data: () => ({
            value: '15826cvv5218'
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
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #3 (error)" v-model="value"></m-textfield>
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
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #4 (waiting)" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('padding="26px"', () => ({
        data: () => ({
            value: 'This is a value!'
        }),
        props: {
            editMode: {
                default: boolean('editMode', false)
            },
            padding: {
                default: text('waiting', '26px')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :padding="padding">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #5 (padding)" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('editModePadding="32px"', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            },
            editModePadding: {
                default: text('editModePadding', '32px')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :editModePadding="editModePadding">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #6 (editModePadding)" v-model="value"></m-textfield>
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
        template: `<div>
                    <m-inplace-edit :edit-mode.sync="editMode" :title="title">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="Story #7 (title)" v-model="value"></m-textfield>
                   </m-inplace-edit>
                    <br>
                    <p><span style="color: blue">title</span> is set to <span style="color: red">{{ title }}</span></p>
                    </div>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${INPLACE_EDIT_NAME}/tag-style`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all tag styles', () => ({
        data: () => ({
            value: 'This is a value'
        }),
        props: {
            editMode: {
                default: boolean('editMode', true)
            },
            tagStyle: {
                default: select('i-p-e tag style', INPLACE_EDIT_TAGSTYLES, 'h1')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :editModePadding="editModePadding">
                       <span slot="readMode">{{ tagStyle }}</span>
                       <m-textfield :tag-style="tagStyle" slot="editMode" label="Story #7 (Tag Styles)"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }));

