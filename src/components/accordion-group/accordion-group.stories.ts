import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ACCORDION_GROUP_NAME } from '../component-names';
import AccordionGroupPlugin from './accordion-group';
Vue.use(AccordionGroupPlugin);





storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}`, module)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'An Accordion Group')
            }
        },
        template: `<m-accordion-group>
                        <m-accordion>Some Accordion Content</m-accordion>
                        <m-accordion>Some Accordion Content</m-accordion>
                        <m-accordion>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('header', () => ({
        template: `<m-accordion-group>
                        <m-accordion><h3 slot="header">Value specified in header slot for this example and all others to follow</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">Value specified in header slot for this example and all others to follow</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">Value specified in header slot for this example and all others to follow</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('title', () => ({
        template: `<m-accordion-group><h2 slot="title">An Accordion Group Title</h2>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('secondary-content', () => ({
        template: `<m-accordion-group>
                        <h2 slot="title">An Accordion Group Title</h2>
                        <h3 slot="secondary-content">An Accordion Group Title</h3>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('toggle-link-left', () => ({
        template: `<m-accordion-group :toggle-link-left="true">
                        <h2 slot="title">An Accordion Group Title</h2>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('concurrent', () => ({
        template: `<m-accordion-group :concurrent="true">
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/disabled="true"`, module)
    .add('all childrens disabled="false"', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('all childrens disabled="true"', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('childrens disabled="mixed"', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/disabled=false`, module)
    .add('all childrens disabled="false"', () => ({
        template: `<m-accordion-group :disabled="false">
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('all childrens disabled="true"', () => ({
        template: `<m-accordion-group :disabled="false">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('childrens disabled="mixed"', () => ({
        template: `<m-accordion-group :disabled="false">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/skin`, module)

    .add('skin="default"', () => ({
        template: `<m-accordion-group>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('skin="light"', () => ({
        template: `<m-accordion-group skin="light">
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('skin="plain"', () => ({
        template: `<m-accordion-group skin="plain">
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/openedIds=[x,y,z]`, module)

    .add('openedIds=[1,2,3]', () => ({
        template: `<m-accordion-group :openedIds="[1,2,3]">
                        <m-accordion :id="1"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :id="2"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :id="3"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('openedIds=[1,3]', () => ({
        template: `<m-accordion-group :openedIds="[1,3]">
                        <m-accordion :id="1"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :id="2"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :id="3"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('openedIds=[]', () => ({
        template: `<m-accordion-group :openedIds="[]">
                        <m-accordion :id="1"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :id="2"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :id="3"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/secondary-content`, module)

    .add('default', () => ({
        template: `<m-accordion-group>
                        <h2 slot="title">An Accordion Group Title</h2>
                        <h3 slot="secondary-content">An Accordion Group Title</h3>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('toggle-link-left', () => ({
        template: `<m-accordion-group :toggle-link-left="true">
                        <h2 slot="title">An Accordion Group Title</h2>
                        <h3 slot="secondary-content">An Accordion Group Title</h3>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('m-link', () => ({
        template: `<m-accordion-group :toggle-link-left="true">
                        <h2 slot="title">An Accordion Group Title</h2>
                        <m-link icon-name="m-svg__add-circle-filled" icon-size="22px" mode="button" slot="secondary-content">Add content</m-link>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('no-title', () => ({
        template: `<m-accordion-group>
                        <h3 slot="secondary-content">An Accordion Group Title</h3>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('no-title-toggle-link-left', () => ({
        template: `<m-accordion-group :toggle-link-left="true">
                        <h3 slot="secondary-content">An Accordion Group Title</h3>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));



