import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { RADIO_GROUP_NAME } from '../component-names';
import RadioPlugin from '../radio/radio';
import RadioGroupPlugin from './radio-group';

Vue.use(RadioPlugin);
Vue.use(RadioGroupPlugin);





storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}`, module)

    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Radio Group')
            }
        },
        template: `<m-radio-group>
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('inline', () => ({
        template: `<m-radio-group inline="true">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('radios-vertical-align="center"', () => ({
        template: `<m-radio-group radios-vertical-align="center">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('radios-margin-top="10px"', () => ({
        template: `<m-radio-group radios-margin-top="10px">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('label', () => ({
        template: `<m-radio-group label="This is a label">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('icon slot', () => ({
        template: `<m-radio-group label="This is a label">
                        <template #icon>
                            <m-icon name="m-svg__add-circle" />
                        </template>
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('focus', () => ({
        template: `<m-radio-group :focus="true">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('error', () => ({
        template: `<m-radio-group :error="true">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('valid', () => ({
        template: `<m-radio-group :valid="true">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('error-message', () => ({
        template: `<m-radio-group error-message="This is an error message">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('error-message & label', () => ({
        template: `<m-radio-group error-message="This is an error message" label="This is a label">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('required-marker', () => ({
        template: `<m-radio-group :required-marker="true" label="This is a label">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}/radios-position="right"`, module)
    .add('inline', () => ({
        template: `<m-radio-group inline="true" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('radios-vertical-align="center"', () => ({
        template: `<m-radio-group radios-position="right" radios-vertical-align="center">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('radios-margin-top="10px"', () => ({
        template: `<m-radio-group radios-margin-top="10px" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('disabled', () => ({
        template: `<m-radio-group :disabled="true" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('readonly', () => ({
        template: `<m-radio-group :readonly="true" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('label', () => ({
        template: `<m-radio-group label="This is a label" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('focus', () => ({
        template: `<m-radio-group :focus="true" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('error', () => ({
        template: `<m-radio-group :error="true" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('valid', () => ({
        template: `<m-radio-group :valid="true" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('error-message', () => ({
        template: `<m-radio-group error-message="This is an error message" radios-position="right">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}/readonly="false"`, module)
    .add('all childrens readonly="false"', () => ({
        template: `<m-radio-group :readonly="false">
                        <m-radio :readonly="false">Radio Option 1</m-radio>
                        <m-radio :readonly="false">Radio Option 2</m-radio>
                        <m-radio :readonly="false">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens readonly="true"', () => ({
        template: `<m-radio-group :readonly="true">
                        <m-radio :readonly="true">Radio Option 1</m-radio>
                        <m-radio :readonly="true">Radio Option 2</m-radio>
                        <m-radio :readonly="true">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens readonly="mixed"', () => ({
        template: `<m-radio-group :readonly="true">
                        <m-radio :readonly="false">Radio Option 1</m-radio>
                        <m-radio :readonly="true">Radio Option 2</m-radio>
                        <m-radio :readonly="false">Radio Option 3</m-radio>
    </m-radio-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}/readonly="true"`, module)

    .add('default', () => ({
        template: `<m-radio-group :readonly="true">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens readonly="false"', () => ({
        template: `<m-radio-group :readonly="true">
                        <m-radio :readonly="false">Radio Option 1</m-radio>
                        <m-radio :readonly="false">Radio Option 2</m-radio>
                        <m-radio :readonly="false">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens readonly="true"', () => ({
        template: `<m-radio-group :readonly="true">
                        <m-radio :readonly="true">Radio Option 1</m-radio>
                        <m-radio :readonly="true">Radio Option 2</m-radio>
                        <m-radio :readonly="true">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens readonly="mixed"', () => ({
        template: `<m-radio-group :readonly="true">
                        <m-radio :readonly="true">Radio Option 1</m-radio>
                        <m-radio :readonly="false">Radio Option 2</m-radio>
                        <m-radio :readonly="true">Radio Option 3</m-radio>
    </m-radio-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}/disabled="false"`, module)
    .add('all childrens disabled="false"', () => ({
        template: `<m-radio-group :disabled="false">
                        <m-radio :disabled="false">Radio Option 1</m-radio>
                        <m-radio :disabled="false">Radio Option 2</m-radio>
                        <m-radio :disabled="false">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens disabled="true"', () => ({
        template: `<m-radio-group :disabled="true">
                        <m-radio :disabled="true">Radio Option 1</m-radio>
                        <m-radio :disabled="true">Radio Option 2</m-radio>
                        <m-radio :disabled="true">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens disabled="mixed"', () => ({
        template: `<m-radio-group :disabled="true">
                        <m-radio :disabled="false">Radio Option 1</m-radio>
                        <m-radio :disabled="true">Radio Option 2</m-radio>
                        <m-radio :disabled="false">Radio Option 3</m-radio>
    </m-radio-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}/disabled="true"`, module)
    .add('default', () => ({
        template: `<m-radio-group :disabled="true">
                        <m-radio>Radio Option 1</m-radio>
                        <m-radio>Radio Option 2</m-radio>
                        <m-radio>Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens disabled="false"', () => ({
        template: `<m-radio-group :disabled="true">
                        <m-radio :disabled="false">Radio Option 1</m-radio>
                        <m-radio :disabled="false">Radio Option 2</m-radio>
                        <m-radio :disabled="false">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens disabled="true"', () => ({
        template: `<m-radio-group :disabled="true">
                        <m-radio :disabled="true">Radio Option 1</m-radio>
                        <m-radio :disabled="true">Radio Option 2</m-radio>
                        <m-radio :disabled="true">Radio Option 3</m-radio>
                   </m-radio-group>`
    }))
    .add('all childrens disabled="mixed"', () => ({
        template: `<m-radio-group :disabled="true">
                        <m-radio :disabled="true">Radio Option 1</m-radio>
                        <m-radio :disabled="false">Radio Option 2</m-radio>
                        <m-radio :disabled="true">Radio Option 3</m-radio>
    </m-radio-group>`
    }));

