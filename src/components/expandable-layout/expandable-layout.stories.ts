import { withA11y } from '@storybook/addon-a11y';
import { boolean, knob, radios, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { EXPANDABLE_LAYOUT_NAME } from '../component-names';
import ExpandableLayoutPlugin, { MExpandableLayoutPanelPosition } from './expandable-layout';
Vue.use(ExpandableLayoutPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${EXPANDABLE_LAYOUT_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            mainContent: {
                default: text('default slot', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim accusamus sint minus, modi rerum pariatur molestiae repellat ipsam suscipit id, accusantium a neque mollitia ab culpa! Quisquam maiores inventore reprehenderit?')
            },
            panelContent: {
                default: text('panel slot', `panel content`)
            },
            open: {
                default: boolean('open', false)
            },
            panelPosition: {
                default: radios('panel position', { left: MExpandableLayoutPanelPosition.Left, right: MExpandableLayoutPanelPosition.Right }, MExpandableLayoutPanelPosition.Left)
            },
            size: {
                default: knob('size', { type: 'number', value: 320 })
            }
        },
        template: '<m-expandable-layout :open="open" :panel-position="panelPosition" :size="size">{{ mainContent }} <template slot="panel">{{ panelContent }}</template></m-expandable-layout>'
    }))

    .add('open', () => ({
        template: '<m-expandable-layout :open="true">main content<template slot="panel">panel content</template></m-expandable-layout>'
    }))
    .add('panel-position="right"', () => ({
        template: '<m-expandable-layout panel-position="right" :open="true">main content<template slot="panel">panel content</template></m-expandable-layout>'
    }))
    .add('size', () => ({
        template: '<m-expandable-layout :size="600" :open="true">main content<template slot="panel">panel content</template></m-expandable-layout>'
    }));
