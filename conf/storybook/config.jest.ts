import { configure } from '@storybook/vue';
import Vue from 'vue';
import { ModulPlugin } from './modul';


Vue.use(ModulPlugin);

// const loadJestStories = () => {
//     const req = require.context('../../src', true, /\.stories\.ts$/);
//     req.keys().forEach(filename => req(filename));
// };

configure(() => {
    require('../../src/components/button/button.stories.ts');
}, module);
