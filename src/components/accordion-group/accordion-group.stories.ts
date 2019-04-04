import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ACCORDION_GROUP_NAME } from '../component-names';
import AccordionGroupPlugin from './accordion-group';
Vue.use(AccordionGroupPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'An Accordion Group')
            }
        },
        template: `<m-accordion-group>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('title', () => ({
        template: `<m-accordion-group><h2 slot="title">An Accordion Group Title</h2>
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
    }))
    .add('disabled', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/disabled/disabled=true`, module)
    .addDecorator(withA11y)
    .add('all childrens disabled=false', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('all childrens disabled=true', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('childrens disabled=mixed', () => ({
        template: `<m-accordion-group :disabled="true">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/disabled/disabled=false`, module)
    .addDecorator(withA11y)
    .add('all childrens disabled=false', () => ({
        template: `<m-accordion-group :disabled="false">
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('all childrens disabled=true', () => ({
        template: `<m-accordion-group :disabled="false">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('childrens disabled=mixed', () => ({
        template: `<m-accordion-group :disabled="false">
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="false"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion :disabled="true"><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }));


storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/skin`, module)
    .addDecorator(withA11y)
    .add('skin=default', () => ({
        template: `<m-accordion-group>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('skin=light', () => ({
        template: `<m-accordion-group skin="light">
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))
    .add('skin=plain', () => ({
        template: `<m-accordion-group skin="plain">
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
                        <m-accordion><h3 slot="header">An Accordion Title</h3>Some Accordion Content</m-accordion>
    </m-accordion-group>`
    }))

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_GROUP_NAME}/openedIds=[x,y,z]`, module)
    .addDecorator(withA11y)
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
    }))



