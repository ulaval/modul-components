
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/vue';
import Vue from 'vue';
import { loadStories } from './all.storybook';
import { ModulPlugin } from './modul';
import modulTheme from './modul-theme';
import { getSandboxPlugin } from './sandbox-loader';
import { loadSandboxStories } from './sandboxes.storybook';
import { hierarchyRootSeparatorRegex, hierarchySeparatorRegex } from './utils';


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

Vue.use(ModulPlugin);

// load all sandboxes
Vue.use(getSandboxPlugin());

// Option defaults:
addParameters({
    options: {
        /**
         * show story component as full screen
         * @type {Boolean}
         */
        isFullScreen: false,
        /**
         * display panel that shows a list of stories
         * @type {Boolean}
         */
        showNav: true,
        /**
         * display panel that shows addon configurations
         * @type {Boolean}
         */
        showPanel: true,
        /**
         * where to show the addon panel
         * @type {('bottom'|'right')}
         */
        panelPosition: 'bottom',
        /**
         * regex for finding the hierarchy separator
         * @example:
         *   null - turn off hierarchy
         *   /\// - split by `/`
         *   /\./ - split by `.`
         *   /\/|\./ - split by `/` or `.`
         * @type {Regex}
         */
        hierarchySeparator: hierarchySeparatorRegex,
        /**
         * regex for finding the hierarchy root separator
         * @example:
         *   null - turn off multiple hierarchy roots
         *   /\|/ - split by `|`
         * @type {Regex}
         */
        hierarchyRootSeparator: hierarchyRootSeparatorRegex,
        /**
         * sidebar tree animations
         * @type {Boolean}
         */
        sidebarAnimations: true,
        /**
         * enable/disable shortcuts
         * @type {Boolean}
         */
        enableShortcuts: false,

        isToolshown: true,

        theme: modulTheme
    }
});


addDecorator(withA11y);
addDecorator(withKnobs);

configure(() => {
    return [require('../../tests/storybook/welcome.stories.ts'), loadStories(), loadSandboxStories()];
}, module);
