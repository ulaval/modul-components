import { withA11y } from '@storybook/addon-a11y';
import { boolean, radios, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { EXPANDABLE_LAYOUT_NAME } from '../component-names';
import ExpandableLayoutPlugin, { MExpandableLayoutMode, MExpandableLayoutPanelPosition } from './expandable-layout';
Vue.use(ExpandableLayoutPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${EXPANDABLE_LAYOUT_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            open: {
                default: boolean('open', true)
            },
            mode: {
                default: radios('mode', { static: MExpandableLayoutMode.Static, follow: MExpandableLayoutMode.Follow }, MExpandableLayoutMode.Static)
            },
            panelPosition: {
                default: radios('panel-position', { left: MExpandableLayoutPanelPosition.Left, right: MExpandableLayoutPanelPosition.Right }, MExpandableLayoutPanelPosition.Left)
            },
            panelWidth: {
                default: text('panel-width', '320px')
            },
            mainContentHeight: {
                default: text('simulated main content height', '200vh')
            },
            panelContentHeight: {
                default: text('simulated panel content height', '300vh')
            }
        },
        template: `
        <m-expandable-layout :open="open" :mode="mode" :panel-position="panelPosition" :panel-width="panelWidth" style="background: yellow;">
            <div :style="{background: 'lightgrey', height: mainContentHeight}">main content</div>
            <div slot="panel" :style="{height: panelContentHeight}">panel content</div>
        </m-expandable-layout>`
    }))
    .add('open', () => ({
        template: '<m-expandable-layout :open="true">main content<template slot="panel">panel content</template></m-expandable-layout>'
    }))
    .add('panel-position="right"', () => ({
        template: '<m-expandable-layout panel-position="right" :open="true">main content<template slot="panel">panel content</template></m-expandable-layout>'
    }))
    .add('panel-width="600"', () => ({
        template: '<m-expandable-layout :panel-width="600" :open="true">main content<template slot="panel">panel content</template></m-expandable-layout>'
    }))
    .add('without panel slot', () => ({
        template: '<m-expandable-layout :panel-width="600" :open="true">main content</m-expandable-layout>'
    }));
