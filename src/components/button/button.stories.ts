import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentshierarchyRootSeparator } from '../../../conf/storybook/utils';
import { BUTTON_NAME } from '../component-names';
import ButtonPlugin from './button';

Vue.use(ButtonPlugin);

storiesOf(`${componentshierarchyRootSeparator}${BUTTON_NAME}`, module)
    .add('default', () => '<m-button ></m-button>');
