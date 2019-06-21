import { boolean, radios, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { EXPANDABLE_LAYOUT_NAME } from '../component-names';
import ExpandableLayoutPlugin, { MExpandableLayoutPanelPosition, MExpandableLayoutPanelScrollMode } from './expandable-layout';
Vue.use(ExpandableLayoutPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${EXPANDABLE_LAYOUT_NAME}`, module)


    .add('default', () => ({
        props: {
            open: {
                default: boolean('open', true)
            },
            panelScrollMode: {
                default: radios('panel-scroll-mode', { static: MExpandableLayoutPanelScrollMode.Static, follow: MExpandableLayoutPanelScrollMode.Follow }, MExpandableLayoutPanelScrollMode.Static)
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
        <m-expandable-layout :open="open" :panel-scroll-mode="panelScrollMode" :panel-position="panelPosition" :panel-width="panelWidth" style="background: yellow;">
            <div :style="{background: 'lightgrey', height: mainContentHeight}">main content</div>
            <div slot="panel" :style="{height: panelContentHeight}">panel content</div>
        </m-expandable-layout>`
    }))
    .add('open', () => ({
        template: `<m-expandable-layout :open="true" style="background: yellow;">
            <div style="background: lightgrey">main content</div>
            <template slot="panel">panel content</template>
        </m-expandable-layout>`
    }))
    .add('panel-position="right"', () => ({
        template: `<m-expandable-layout panel-position="right" :open="true" style="background: yellow;">
            <div style="background: lightgrey">main content</div>
            <template slot="panel">panel content</template>
        </m-expandable-layout>`
    }))
    .add('panel-width="600px"', () => ({
        template: `<m-expandable-layout panel-width="600px" :open="true" style="background: yellow;">
            <div style="background: lightgrey">main content</div>
            <template slot="panel">panel content</template>
        </m-expandable-layout>`
    }))
    .add('without panel slot', () => ({
        template: `<m-expandable-layout :panel-width="600" :open="true" style="background: yellow;">
            <div style="background: lightgrey">main content</div>
        </m-expandable-layout>`
    }));
