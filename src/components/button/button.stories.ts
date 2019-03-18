import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import ButtonSandboxPlugin from './button.sandbox';


Vue.use(ButtonSandboxPlugin);

storiesOf('m-button', module)
    .add('sandbox', () => '<div ><m-button-sandbox class="m-u--app-body"></m-button-sandbox>');
