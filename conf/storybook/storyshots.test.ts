import initStoryshots from '@storybook/addon-storyshots';
import Vue from 'vue';
import ButtonPlugin from '../../src/components/button/button';

declare module '@storybook/addon-storyshots' {
    export const Stories2SnapsConverter: any;
}

initStoryshots({
    config: ({ configure }) => {

        Vue.use(ButtonPlugin);

        configure(() => {
            require('../../src/components/button/button.stories.ts');
        }, module);
    }

} as any);
