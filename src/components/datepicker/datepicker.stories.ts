import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { DATEPICKER_NAME } from '../component-names';
import DatepickerPlugin from './datepicker';

Vue.use(DatepickerPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${DATEPICKER_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        template: `<m-datepicker></m-datepicker>`
    }))
    .add('v-model', () => ({
        props: {
            model1: {
                default: text('Date', '2011-01-01')
            }
        },
        template: `<div><m-datepicker v-model="model1"></m-datepicker> <br/>model value = {{model1}}</div>`
    }))

    .add('label', () => ({
        template: `<m-datepicker label="Date label"></m-datepicker>`
    }))

    .add('placeholder', () => ({
        template: `<m-datepicker placeholder="Lorem Ipsum"></m-datepicker>`
    }))

    .add('waiting', () => ({
        template: `<m-datepicker :waiting="true"></m-datepicker>`
    }))

    .add('min="2008-01-01" && max="2014-12-31"', () => ({
        template: `<m-datepicker min="2008-01-01" max="2014-12-31"></m-datepicker>`
    }))

    .add('disabled', () => ({
        template: `<m-datepicker :disabled="true"></m-datepicker>`
    }))
    .add('readonly', () => ({
        template: `<m-datepicker :readonly="true"></m-datepicker>`
    }))
    .add('valid', () => ({
        template: `<m-datepicker :valid="true"></m-datepicker>`
    }))
    .add('error-message', () => ({
        template: `<m-datepicker :error="true" error-message="this is an error"></m-datepicker>`
    }));

