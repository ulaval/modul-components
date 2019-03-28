import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { RADIO_GROUP_NAME } from '../component-names';
import RadioPlugin from '../radio/radio';
import RadioGroupPlugin from './radio-group';

Vue.use(RadioPlugin);
Vue.use(RadioGroupPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Radio Group')
            }
        },
        template: '<m-radio-group>{{ text }}</m-radio-group>'
    }))
    //TODO value
    .add('value', () => ({
        template: `<m-radio-group>
                        <m-radio value="1">1
                        <m-radio value="2">2
                        <m-radio value="3">3
                   </m-radio></m-radio-group>`
    }))
    .add('radiosPosition=right', () => ({
        template: `<m-radio-group radiosPosition="right">
                        <m-radio value="1">1
                        <m-radio value="2">2
                        <m-radio value="3">3
                   </m-radio></m-radio-group>`
    }))
    //TODO inline
    .add('inline', () => ({
        template: `<m-radio-group>
                        <m-radio value="1">1
                        <m-radio value="2">2
                        <m-radio value="3">3
                   </m-radio></m-radio-group>`
    }))
    .add('radiosVerticalAlign', () => ({
        template: `<m-radio-group radiosVerticalAlign="true">
                        <m-radio value="1">1
                        <m-radio value="2">2
                        <m-radio value="3">3
                   </m-radio></m-radio-group>`
    }))
    .add('radiosMarginTop=10px', () => ({
        template: `<m-radio-group radiosMarginTop="10px">
                        <m-radio value="1">1
                        <m-radio value="2">2
                        <m-radio value="3">3
                   </m-radio></m-radio-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${RADIO_GROUP_NAME}/radiosPosition=right`, module)
    .addDecorator(withA11y)
    .add('TBD', () => ({
        template: `<m-radio-group radiosPosition="right">
                        <m-radio value="1">1
                        <m-radio value="2">2
                        <m-radio value="3">3
                   </m-radio></m-radio-group>`
    }));
