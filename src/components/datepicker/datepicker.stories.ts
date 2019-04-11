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
        props: {
            text: {
                default: text('Text', 'A Dialog')
            }
        },
        template: `<m-datepicker>{{ text }}</m-datepicker>`
    }))
    .add('value', () => ({
        template: `<m-datepicker value="2019/04/04"></m-datepicker>`
    }))
    .add('v-model', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-datepicker v-model="model1"></m-datepicker>`
    }))
    .add('icon-name="m-svg__profile"', () => ({
        template: `<m-datepicker icon-name="m-svg__profile"></m-datepicker>`
    }))
    .add('placeholder', () => ({
        template: `<m-datepicker placeholder="Lorem Ipsum"></m-datepicker>`
    }))
    .add('min="2001-01-01"', () => ({
        template: `<m-datepicker min="2001-01-01"></m-datepicker>`
    }))
    .add('max="2038-12-31"', () => ({
        template: `<m-datepicker max="2038-12-31"></m-datepicker>`
    }))
    .add('min="2008-01-01" && max="2014-12-31"', () => ({
        template: `<m-datepicker min="2008-01-01" max="2014-12-31"></m-datepicker>`
    }))
    .add('required', () => ({
        template: `<m-datepicker :required="true"></m-datepicker>`
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
    .add('invalid', () => ({
        template: `<m-datepicker :invalid="true"></m-datepicker>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DATEPICKER_NAME}/format`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: `<m-datepicker required="true"></m-datepicker>`
    }))
    .add('format="DD/MM/YYYY"', () => ({
        template: `<m-datepicker format="DD/MM/YYYY"></m-datepicker>`
    }))
    .add('format="YYYY/MM/DD', () => ({
        template: `<m-datepicker format="YYYY/MM/DD"></m-datepicker>`
    }));


