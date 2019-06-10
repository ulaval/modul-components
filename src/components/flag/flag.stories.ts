import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { FLAG_NAME } from '../component-names';
import FlagPlugin from './flag';

Vue.use(FlagPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${FLAG_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        template: '<m-flag iso="it"></m-flag>'
    }));
