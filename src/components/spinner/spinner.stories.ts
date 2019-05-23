import { withA11y } from '@storybook/addon-a11y';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { SPINNER_NAME } from '../component-names';
import SpinnerPlugin, { MSpinnerSize, MSpinnerStyle } from './spinner';

Vue.use(SpinnerPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${SPINNER_NAME}`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-spinner></m-spinner>'
    }))
    .add('title', () => ({
        props: {
            title: {
                default: boolean('title', true)
            }
        },
        template: '<m-spinner :title="title"></m-spinner>'
    }))
    .add('title-message', () => ({
        props: {
            titleMessage: {
                default: text('title-message (default text when not specified)', 'This is a custom title-message')
            }
        },
        template: '<m-spinner :title-message="titleMessage"></m-spinner>'
    }))
    .add('description', () => ({
        props: {
            description: {
                default: boolean('description', true)
            }
        },
        template: '<m-spinner :description="description"></m-spinner>'
    }))
    .add('description-message', () => ({
        props: {
            descriptionMessage: {
                default: text('description-message (default text when not specified)', 'This is a custom description-message')
            }
        },
        template: '<m-spinner :description-message="descriptionMessage"></m-spinner>'
    }))
    .add('processing', () => ({
        props: {
            processing: {
                default: boolean('processing', true)
            }
        },
        template: '<m-spinner skin="light" :processing="processing"></m-spinner>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${SPINNER_NAME}/skin`, module)
    .addDecorator(withA11y)
    .add('skin="regular"', () => ({
        template: '<m-spinner skin="regular"></m-spinner>'
    }))
    .add('skin="light"', () => ({
        template: '<m-spinner skin="light"></m-spinner>'
    }))
    .add('skin="lighter"', () => ({
        template: `<div style="background: black">
                        <m-spinner skin="lighter"></m-spinner>
                   </div>`
    }))
    .add('skin="dark"', () => ({
        template: '<m-spinner skin="dark"></m-spinner>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${SPINNER_NAME}/size`, module)
    .addDecorator(withA11y)
    .add('size="small"', () => ({
        template: '<m-spinner size="small"></m-spinner>'
    }))
    .add('size="large"', () => ({
        template: '<m-spinner size="large"></m-spinner>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${SPINNER_NAME}/knobs`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all props', () => ({
        props: {
            title: {
                default: boolean('title', true)
            },
            titleMessage: {
                default: text('title-message (default text when not specified)', '')
            },
            description: {
                default: boolean('description', true)
            },
            descriptionMessage: {
                default: text('description-message (default text when not specified)', '')
            },
            processing: {
                default: boolean('processing', false)
            },
            skin: {
                default: select('skin', Object.values(MSpinnerStyle), MSpinnerStyle.Regular)
            },
            size: {
                default: select('size', Object.values(MSpinnerSize), MSpinnerSize.Small)
            }
        },
        template: `<div>
                        <m-spinner :description="description" :description-message="descriptionMessage"
                        :processing="processing" :skin="skin" :size="size" :title="title"
                        :title-message="titleMessage"></m-spinner>
                   </div>`
    }));


