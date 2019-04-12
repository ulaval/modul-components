import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
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
        data: () => ({
            model1: '2011-01-01'
        }),
        template: `<div><m-datepicker v-model="model1"></m-datepicker> <br/> <br/>model value = {{model1}}</div>`
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
        data: () => ({
            model1: '2011-01-01'
        }),
        template: `<div><m-datepicker min="2008-01-01" max="2014-12-31" v-model="model1"></m-datepicker>model value = {{model1}}</div>`
    }))
    .add('date format invalide', () => ({
        data: () => ({
            model1: '01ad01/2000'
        }),
        template: `<div><m-datepicker min="2008-01-01" max="2014-12-31" v-model="model1"></m-datepicker>model value = {{model1}}</div>`
    }))
    .add('date hors limite min', () => ({
        data: () => ({
            model1: '2000-01-01'
        }),
        template: `<div><m-datepicker min="2008-01-01" max="2014-12-31" v-model="model1"></m-datepicker>model value = {{model1}}</div>`
    }))
    .add('date hors limite max', () => ({
        data: () => ({
            model1: '2015-01-01'
        }),
        template: `<div><m-datepicker min="2008-01-01" max="2014-12-31" v-model="model1"></m-datepicker>model value = {{model1}}</div>`
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

