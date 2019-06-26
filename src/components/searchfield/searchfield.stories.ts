import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { SEARCHFIELD_NAME } from '../component-names';
import SearchfieldPlugin from './searchfield';

Vue.use(SearchfieldPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${SEARCHFIELD_NAME}`, module)
    .add('default', () => ({
        template: `
            <div>
                <div><${SEARCHFIELD_NAME} v-model="value"></${SEARCHFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }))
    .add('with label', () => ({
        template: `
            <div>
                <div><${SEARCHFIELD_NAME} v-model="value" label="What are you look for today ?"></${SEARCHFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }));
