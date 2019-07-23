import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ACCORDION_NAME } from '../component-names';
import AccordionPlugin from './accordion';
Vue.use(AccordionPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}`, module)

    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'Accordion')
            }
        },
        template: '<m-accordion>{{ text }}</m-accordion>'
    }))

    .add('header', () => ({
        template: '<m-accordion><h3 class="m-u--no-margin" slot="header">Value specified in header slot for this example and all others to follow</h3> Some Accordion Content</m-accordion>'
    }))
    .add('id', () => ({
        template: '<m-accordion id="id123"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('open', () => ({
        template: '<m-accordion open="true"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('disabled', () => ({
        template: '<m-accordion :disabled="true"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-border="true"', () => ({
        template: '<m-accordion icon-border="true"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('empty $slots.default', () => ({
        template: '<m-accordion icon-border="true"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3></m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/icon-size="small"`, module)
    .add('default', () => ({
        template: '<m-accordion icon-size="small"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-border="true"', () => ({
        template: '<m-accordion icon-border="true" icon-size="small"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/icon-position="right"`, module)
    .add('default', () => ({
        template: '<m-accordion icon-position="right"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-border="true"', () => ({
        template: '<m-accordion icon-border="true" icon-position="right"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-size="small"', () => ({
        template: '<m-accordion icon-size="small" icon-position="right"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('icon-size="small && icon-border="true"', () => ({
        template: '<m-accordion icon-border="true" icon-size="small" icon-position="right"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/padding`, module)
    .add('default', () => ({
        template: '<m-accordion :padding="true"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('padding-header="false"', () => ({
        template: '<m-accordion :padding="false" :padding-header="false"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('padding-body="false"', () => ({
        template: '<m-accordion :padding="false" :padding-body="false"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/skin`, module)
    .add('default', () => ({
        template: '<m-accordion skin="default"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('dark', () => ({
        template: '<m-accordion skin="dark"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('dark-b', () => ({
        template: '<m-accordion skin="dark-b"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('light', () => ({
        template: '<m-accordion skin="light"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('plain', () => ({
        template: '<m-accordion skin="plain"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_NAME}/keepContentAlive`, module)
    .add('default', () => ({
        template: '<m-accordion :keep-content-alive="false"><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }))
    .add('keep-content-alive="true"', () => ({
        template: '<m-accordion :keep-content-alive="true" ><h3 class="m-u--no-margin" slot="header">An Accordion Title</h3> Some Accordion Content</m-accordion>'
    }));
