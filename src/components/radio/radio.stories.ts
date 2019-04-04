import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { RADIO_NAME } from '../component-names';
import RadioPlugin from './radio';

Vue.use(RadioPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${RADIO_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
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
        template: '<m-radio name="radio-2">A Radio</m-radio>'
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
    .add('radioPosition=right', () => ({
        template: '<m-radio radioPosition="right">A Radio</m-radio>'
    }))
    .add('radioVerticalAlign=center', () => ({
        template: '<m-radio radioVerticalAlign="center">A Radio</m-radio>'
    }))
    .add('focus', () => ({
        template: '<m-radio :focus="true">A Checkbox</m-radio>'
    }))
    .add('error', () => ({
        template: '<m-radio :error="true">A Checkbox</m-radio>'
    }))
    .add('valid', () => ({
        template: '<m-radio :valid="true">A Checkbox</m-radio>'
    }))
    // iconName should not render anything when the m-radio component is not part of a radio-group
    .add('iconName=chip-error', () => ({
        template: '<m-radio iconName="chip-error">A Checkbox</m-radio>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_NAME}/radioPosition=right`, module)
    .addDecorator(withA11y)
    .add('value', () => ({
        template: '<m-radio radioPosition="right" value="radio4-value">A Radio</m-radio>'
    }))
    .add('name', () => ({
        template: '<m-radio name="radio5" radioPosition="right">A Radio</m-radio>'
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
    .add('radioVerticalAlign=center', () => ({
        template: '<m-radio radioPosition="right" radioVerticalAlign="center">A Radio</m-radio>'
    }))
    .add('focus', () => ({
        template: '<m-radio :focus="true" radioPosition="right">A Radio</m-radio>'
    }))
    .add('error', () => ({
        template: '<m-radio :error="true" radioPosition="right">A Checkbox</m-radio>'
    }))
    .add('valid', () => ({
        template: '<m-radio :valid="true" radioPosition="right">A Checkbox</m-radio>'
    }))
    // iconName should not render anything when the m-radio component is not part of a radio-group
    .add('iconName=chip-error', () => ({
        template: '<m-radio iconName="chip-error" radioPosition="right">A Checkbox</m-radio>'
    }));


