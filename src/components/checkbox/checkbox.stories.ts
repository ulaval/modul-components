import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { CHECKBOX_NAME } from '../component-names';
import CheckboxPlugin from './checkbox';
Vue.use(CheckboxPlugin);




const longText: string = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque ipsam placeat dolores esse libero ipsum, officiis asperiores! Distinctio quis, deleniti placeat, hic aperiam quia magnam accusantium at eaque voluptatum ratione! Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam quia culpa quas distinctio sapiente assumenda, soluta obcaecati ipsam reprehenderit aperiam eos blanditiis aspernatur provident libero quod modi quos iusto molestias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi ut consequuntur tempore fuga nihil quibusdam officia deleniti nesciunt, ullam eveniet explicabo unde alias, esse asperiores. Corrupti officiis sunt voluptatibus iure? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab, est! Optio ipsum voluptates alias vel quos!';

storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}`, module)

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
    .add('position=right', () => ({
        template: '<m-checkbox position="right">A Checkbox</m-checkbox>'
    }))
    .add('verticalAlign=top', () => ({
        template: '<m-checkbox verticalAlign="top">' + longText + '</m-checkbox>'
    }))
    .add('verticalAlign=center', () => ({
        template: '<m-checkbox verticalAlign="center">' + longText + '</m-checkbox>'
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
    }));

storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/value`, module)
    .add('disabled', () => ({
        template: '<m-checkbox :disabled="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('readonly', () => ({
        template: '<m-checkbox :readonly="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('focus', () => ({
        template: '<m-checkbox :focus="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('indeterminate', () => ({
        template: '<m-checkbox indeterminate="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('error-message', () => ({
        template: '<m-checkbox error-message="This is an error" value="true">A Checkbox</m-checkbox>'
    }))
    .add('error', () => ({
        template: '<m-checkbox :error="true" value="true">A Checkbox</m-checkbox>'
    }))
    .add('valid', () => ({
        template: '<m-checkbox :valid="true" value="true">A Checkbox</m-checkbox>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${CHECKBOX_NAME}/position=right`, module)
    .add('default', () => ({
        template: '<m-checkbox position="right">A Checkbox</m-checkbox>'
    }))
    .add('value', () => ({
        template: '<m-checkbox position="right" value="true">A Checkbox</m-checkbox>'
    }))
    .add('disabled', () => ({
        template: '<m-checkbox :disabled="true" position="right">A Checkbox</m-checkbox>'
    }))
    .add('readonly', () => ({
        template: '<m-checkbox :readonly="true" position="right">A Checkbox</m-checkbox>'
    }))
    .add('focus', () => ({
        template: '<m-checkbox :focus="true" position="right">A Checkbox</m-checkbox>'
    }))
    .add('indeterminate', () => ({
        template: '<m-checkbox indeterminate="true" position="right">A Checkbox</m-checkbox>'
    }))
    .add('error-message', () => ({
        template: '<m-checkbox error-message="This is an error" position="right">A Checkbox</m-checkbox>'
    }))
    .add('error', () => ({
        template: '<m-checkbox :error="true" position="right">A Checkbox</m-checkbox>'
    }))
    .add('valid', () => ({
        template: '<m-checkbox :valid="true" position="right">A Checkbox</m-checkbox>'
    }));
