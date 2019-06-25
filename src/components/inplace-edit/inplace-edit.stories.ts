import { boolean, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { InputStateTagStyle } from '../../mixins/input-state/input-state';
import { INPLACE_EDIT_NAME } from '../component-names';
import InplaceEditPlugin from './inplace-edit';

Vue.use(InplaceEditPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${INPLACE_EDIT_NAME}`, module)


    .add('default', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: false
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick" >
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="read mode only" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('editMode', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="edit mode" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('error', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        props: {
            error: {
                default: boolean('error', true)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :error="error" @click="onClick">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="error" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('waiting', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        props: {
            waiting: {
                default: boolean('waiting', true)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :waiting="waiting" @click="onClick">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="waiting" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('padding="26px"', () => ({
        data: () => ({
            value: 'This is a value with 26px of padding',
            editMode: false
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        props: {
            padding: {
                default: text('padding', '26px')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :padding="padding" @click="onClick">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="padding" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('edit-mode-padding="32px"', () => ({
        data: () => ({
            value: 'Value with 32px of padding in edit mode',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        props: {
            editModePadding: {
                default: text('editModePadding', '32px')
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" :edit-mode-padding="editModePadding" @click="onClick">
                       <span slot="readMode">{{ value }}</span>
                       <m-textfield slot="editMode" label="edit-mode-padding" v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }));


storiesOf(`${componentsHierarchyRootSeparator}${INPLACE_EDIT_NAME}/mobile`, module)
    .addParameters({ viewport: { defaultViewport: 'iphone6' } })
    .add('title', () => ({
        data: () => ({
            value: 'This is a value with a title prop',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        props: {
            title: {
                default: text('title', 'This is a custom title')
            }
        },
        template: `<div>
                    <m-inplace-edit :edit-mode.sync="editMode" :title="title" @click="onClick">
                    <span slot="readMode">{{ value }}</span>
                    <m-textfield slot="editMode" label="Story #7 (title)" v-model="value"></m-textfield>
                </m-inplace-edit>
                    <br>
                    <p><span style="color: blue">title</span> is set to <span style="color: red">{{ title }}</span></p>
                </div>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${INPLACE_EDIT_NAME}/tag-style`, module)
    .add('all tag styles (knob)', () => ({
        data: () => ({
            value: `This is a value with a tag style`,
            editMode: false
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        props: {
            tagStyle: {
                default: select('tag style', Object.values(InputStateTagStyle), InputStateTagStyle.H1)
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode"  @click="onClick">
                       <span slot="readMode">{{ tagStyle }}</span>
                       <m-textfield :tag-style="tagStyle" slot="editMode" :label="tagStyle"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('h1', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode"  @click="onClick">
                       <span slot="readMode">h1 tag style</span>
                       <m-textfield tag-style="h1" slot="editMode" label="h1 tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('h2', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">h2 tag style</span>
                       <m-textfield tag-style="h2" slot="editMode" label="h2 tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('h3', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">h3 tag style</span>
                       <m-textfield tag-style="h3" slot="editMode" label="h3 tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('h4', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">h4 tag style</span>
                       <m-textfield tag-style="h4" slot="editMode" label="h4 tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('h5', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">h5 tag style</span>
                       <m-textfield tag-style="h5" slot="editMode" label="h5 tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('h6', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">h6 tag style</span>
                       <m-textfield tag-style="h6" slot="editMode" label="h6 tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }))
    .add('p', () => ({
        data: () => ({
            value: 'This is a value',
            editMode: true
        }),
        methods: {
            onClick(): void {
                this.$data.editMode = true;
            }
        },
        template: `<m-inplace-edit :edit-mode.sync="editMode" @click="onClick">
                       <span slot="readMode">p tag style</span>
                       <m-textfield tag-style="p" slot="editMode" label="p tag style"
                       v-model="value"></m-textfield>
                   </m-inplace-edit>`
    }));


