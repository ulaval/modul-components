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
                default: text('Text', 'Accordion')
            }
        },
        template: '<m-accordion> {{ text }}</m-accordion>'
    }))
    .add('id', () => ({
        template: '<m-accordion id="id123"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('open', () => ({
        template: '<m-accordion open="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('disabled', () => ({
        template: '<m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('iconPosition=right', () => ({
        template: '<m-accordion iconPosition="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('iconBorder=true', () => ({
        template: '<m-accordion iconBorder="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('iconSize=small', () => ({
        template: '<m-accordion iconSize="small"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/iconSize=small`, module)
    .addDecorator(withA11y)
    .add('iconBorder=true', () => ({
        template: '<m-accordion iconBorder="true" iconSize="small"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/iconPosition=right`, module)
    .addDecorator(withA11y)
    .add('iconBorder=true', () => ({
        template: '<m-accordion iconBorder="true" iconPosition="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('iconSize=small', () => ({
        template: '<m-accordion iconSize="small" iconPosition="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('iconSize=small && iconBorder=true', () => ({
        template: '<m-accordion iconBorder="true" iconSize="small" iconPosition="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/padding=true`, module)
    .addDecorator(withA11y)
    .add('paddingHeader=true', () => ({
        template: '<m-accordion :padding="true" :paddingHeader="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('paddingBody=true', () => ({
        template: '<m-accordion :padding="true" :paddingBody="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/skin`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-accordion skin="default"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('dark', () => ({
        template: '<m-accordion skin="dark"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('dark-b', () => ({
        template: '<m-accordion skin="dark-b"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('light', () => ({
        template: '<m-accordion skin="light"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('plain', () => ({
        template: '<m-accordion skin="plain"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));

