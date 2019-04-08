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
    // .add('icon-name=""', () => ({
    //     template: `<m-datepicker value="2019/04/04"></m-datepicker>`
    // }))
    .add('required="true"', () => ({
        template: `<m-datepicker required="true"></m-datepicker>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DATEPICKER_NAME}/format`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: `<m-datepicker required="true"></m-datepicker>`
    }));


