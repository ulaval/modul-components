import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { CHECKBOX_NAME } from '../component-names';
import CheckboxPlugin from './checkbox';
Vue.use(CheckboxPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Checkbox')
            }
        },
        template: '<m-checkbox>{{ text }}</m-checkbox>'
    }))
    .add('value', () => ({
        template: '<m-checkbox value="true">A Checkbox</m-checkbox>'
    }))
    .add('indeterminate', () => ({
        template: '<m-checkbox indeterminate="true">A Checkbox</m-checkbox>'
    }))
    .add('position=right', () => ({
        template: '<m-checkbox position="right">A Checkbox</m-checkbox>'
    }))
    .add('disabled', () => ({
        template: '<m-checkbox :disabled="true">A Checkbox</m-checkbox>'
    }))
    .add('readonly', () => ({
        template: '<m-checkbox :readonly="true">A Checkbox</m-checkbox>'
    }))
    .add('label', () => ({
        template: '<m-checkbox label="label">A Checkbox</m-checkbox>'
    }))
    .add('indeterminate', () => ({
        template: '<m-checkbox indeterminate="true">A Checkbox</m-checkbox>'
    }))
    .add('focus', () => ({
        template: '<m-checkbox :focus="true"> Checkbox</m-checkbox>'
    }))
    .add('error-message', () => ({
        template: '<m-checkbox error-message="This is an error"> Checkbox</m-checkbox>'
    }))
    .add('error', () => ({
        template: '<m-checkbox :error="true"> Checkbox</m-checkbox>'
    }))
    .add('valid', () => ({
        template: '<m-checkbox :valid="true"> Checkbox</m-checkbox>'
    }))


storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/disabled=true`, module)
    .addDecorator(withA11y)
    .add('value', () => ({
        template: '<m-checkbox :disabled="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('position=right', () => ({
        template: '<m-checkbox :disabled="true" position="right">A Checkbox</m-checkbox>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/disabled=true/position=right`, module)
    .add('value', () => ({
        template: '<m-checkbox :disabled="true" position="right" value="true">A Checkbox</m-checkbox>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/readonly=true`, module)
    .addDecorator(withA11y)
    .add('value', () => ({
        template: '<m-checkbox :readonly="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('position=right', () => ({
        template: '<m-checkbox :readonly="true" position="right">A Checkbox</m-checkbox>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/readonly=true/position=right`, module)
    .add('value', () => ({
        template: '<m-checkbox :disabled="true" position="right" value="true">A Checkbox</m-checkbox>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/indeterminate=true`, module)
    .addDecorator(withA11y)
    .add('position=right', () => ({
        template: '<m-checkbox indeterminate="true" position="right">A Checkbox</m-checkbox>'
    }))
    .add('disabled', () => ({
        template: '<m-checkbox indeterminate="true" :disabled="true">A Checkbox</m-checkbox>'
    }))

