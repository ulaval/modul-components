import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { INPUT_GROUP_NAME } from '../component-names';
import InputGroupPlugin from './input-group';

Vue.use(InputGroupPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${INPUT_GROUP_NAME}`, module)

    .add('default', () => ({
        template: `<div>
                        <m-input-group>
                            <m-checkbox>Checkbox 1</m-checkbox>
                            <m-checkbox>Checkbox 2</m-checkbox>
                            <m-checkbox>Checkbox 3</m-checkbox>
                        </m-input-group>
                        <m-input-group class="m-u--margin-top--l">
                            <m-textfield label="Texfield 1"></m-textfield>
                            <m-textfield label="Texfield 2"></m-textfield>
                        </m-input-group>
                    </div>`
    }))
    .add('label', () => ({
        template: `<m-input-group label="This is a label">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('required-marker', () => ({
        template: `<m-input-group label="This is a label" :required-marker="true">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('icon slot', () => ({
        template: `<m-input-group label="This is a label" :required-marker="true">
                       <template #icon>
                           <m-icon name="m-svg__add-circle" />
                       </template>
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('error-message', () => ({
        template: `<m-input-group label="This is a label" error-message="This is an error message">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('valid-message', () => ({
        template: `<m-input-group label="This is a label" valid-message="This is an valid message">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('helper-message', () => ({
        template: `<m-input-group label="This is a label" helper-message="This is an helper message">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${INPUT_GROUP_NAME}/validation-message-position`, module)
    .add('top', () => ({
        template: `<m-input-group label="This is a label" error-message="This is an error message" validation-message-position="top">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('bottom', () => ({
        template: `<m-input-group label="This is a label" error-message="This is an error message" validation-message-position="bottom">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('top - no label', () => ({
        template: `<m-input-group error-message="This is an error message" validation-message-position="top">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }))
    .add('bottom - no label', () => ({
        template: `<m-input-group error-message="This is an error message" validation-message-position="bottom">
                       <m-checkbox>Checkbox 1</m-checkbox>
                       <m-checkbox>Checkbox 2</m-checkbox>
                       <m-checkbox>Checkbox 3</m-checkbox>
                   </m-input-group>`
    }));
