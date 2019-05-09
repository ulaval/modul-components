import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { DROPDOWN_NAME } from '../component-names';
import DropdownPlugin from './dropdown';

Vue.use(DropdownPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${DROPDOWN_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-dropdown label="Vegetable" v-model="model1">
                        <m-dropdown-item value="1a" label="Asperge"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Brocoli"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('focus', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-dropdown :focus="true" label="Vegetable" v-model="model1">
                        <m-dropdown-item value="1a" label="Asperge"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Brocoli"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('label-up', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-dropdown :label-up="true" label="Vegetable" v-model="model1" placeholder="placeholder">
                        <m-dropdown-item value="1a" label="Asperge"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Brocoli"></m-dropdown-item>
                    </m-dropdown>`
    }));

