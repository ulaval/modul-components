import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { RADIO_NAME } from '../component-names';
import RadioPlugin from './radio';

Vue.use(RadioPlugin);





storiesOf(`${componentsHierarchyRootSeparator}${RADIO_NAME}`, module)

    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Radio')
            }
        },
        template: '<m-radio>{{ text }}</m-radio>'
    }))
    .add('value', () => ({
        template: '<m-radio value="radio1-value">A Radio</m-radio>'
    }))
    .add('name', () => ({
        template: '<m-radio name="radio2-name">A Radio</m-radio>'
    }))
    .add('label', () => ({
        template: '<m-radio label="radio3-label">A Radio</m-radio>'
    }))
    .add('disabled', () => ({
        template: '<m-radio :disabled="true">A Radio</m-radio>'
    }))
    .add('readonly', () => ({
        template: '<m-radio :readonly="true">A Radio</m-radio>'
    }))
    .add('radio-vertical-align="center"', () => ({
        template: '<m-radio radio-vertical-align="center">A Radio</m-radio>'
    }))
    .add('focus', () => ({
        template: '<m-radio :focus="true">A Checkbox</m-radio>'
    }))
    .add('error', () => ({
        template: '<m-radio :error="true">A Checkbox</m-radio>'
    }))
    .add('valid', () => ({
        template: '<m-radio :valid="true">A Checkbox</m-radio>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_NAME}/radio-position="right"`, module)
    .add('default', () => ({
        template: '<m-radio radio-position="right">A Radio</m-radio>'
    }))
    .add('value', () => ({
        template: '<m-radio radio-position="right" value="radio4-value">A Radio</m-radio>'
    }))
    .add('name', () => ({
        template: '<m-radio name="radio5-name" radioPosition="right">A Radio</m-radio>'
    }))
    .add('label', () => ({
        template: '<m-radio label="radio6-label" radioPosition="right">A Radio</m-radio>'
    }))
    .add('disabled', () => ({
        template: '<m-radio :disabled="true" radioPosition="right">A Radio</m-radio>'
    }))
    .add('readonly', () => ({
        template: '<m-radio :readonly="true" radioPosition="right">A Radio</m-radio>'
    }))
    .add('radio-vertical-align="center"', () => ({
        template: '<m-radio radioPosition="right" radio-vertical-align="center">A Radio</m-radio>'
    }))
    .add('focus', () => ({
        template: '<m-radio :focus="true" radioPosition="right">A Radio</m-radio>'
    }))
    .add('error', () => ({
        template: '<m-radio :error="true" radioPosition="right">A Checkbox</m-radio>'
    }))
    .add('valid', () => ({
        template: '<m-radio :valid="true" radioPosition="right">A Checkbox</m-radio>'
    }));


