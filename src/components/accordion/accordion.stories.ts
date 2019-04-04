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
        template: '<m-accordion>{{ text }}</m-accordion>'
    }))

    .add('header', () => ({
        template: '<m-accordion><h3 slot="header">Value specified in header slot for this example and all others to follow</h3> Some Accordion Content</m-accordion>'
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
    .add('icon-border="true"', () => ({
        template: '<m-accordion icon-border="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/icon-size="small"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-accordion icon-size="small"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-border="true"', () => ({
        template: '<m-accordion icon-border="true" icon-size="small"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/icon-position="right"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-accordion icon-position="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-border="true"', () => ({
        template: '<m-accordion icon-border="true" icon-position="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-size="small"', () => ({
        template: '<m-accordion icon-size="small" icon-position="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-size="small && icon-border="true"', () => ({
        template: '<m-accordion icon-border="true" icon-size="small" icon-position="right"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/padding`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-accordion :padding="true"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('padding-header="false"', () => ({
        template: '<m-accordion :padding="false" :padding-header="false"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('padding-body="false"', () => ({
        template: '<m-accordion :padding="false" :padding-body="false"><h3 slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
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
