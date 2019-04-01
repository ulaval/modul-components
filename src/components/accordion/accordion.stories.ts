import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ACCORDION_NAME } from '../component-names';
import AccordionPlugin from './accordion';
Vue.use(AccordionPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'An Accordion')
            }
        },
        template: '<m-accordion>{{ text }}</m-accordion>'
    }))
    .add('value', () => ({
        template: '<m-accordion open="true">An Accordion</m-accordion>'
    }))
    .add('disabled', () => ({
        template: '<m-accordion :disabled="true">An Accordion</m-accordion>'
    }))
    .add('iconPosition=right', () => ({
        template: '<m-accordion iconPosition="right">An Accordion</m-accordion>'
    }))
    .add('iconBorder=true', () => ({
        template: '<m-accordion iconBorder="true">An Accordion</m-accordion>'
    }))
    .add('iconSize=large', () => ({
        template: '<m-accordion iconSize="large">An Accordion</m-accordion>'
    }))
    .add('padding=true', () => ({
        template: '<m-accordion padding="true">An Accordion</m-accordion>'
    }))
    .add('paddingHeader=true', () => ({
        template: '<m-accordion paddingHeader="true">An Accordion</m-accordion>'
    }))
    .add('paddingBody=true', () => ({
        template: '<m-accordion paddingBody="true">An Accordion</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/skin`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-accordion skin="default">An Accordion</m-accordion>'
    }))
    .add('dark', () => ({
        template: '<m-accordion skin="dark">An Accordion</m-accordion>'
    }))
    .add('dark-b', () => ({
        template: '<m-accordion skin="dark-b">An Accordion</m-accordion>'
    }))
    .add('light', () => ({
        template: '<m-accordion skin="light">An Accordion</m-accordion>'
    }))
    .add('plain', () => ({
        template: '<m-accordion skin="plain">An Accordion</m-accordion>'
    }));

