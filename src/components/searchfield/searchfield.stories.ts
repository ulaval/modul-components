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
    .add('placeholder', () => ({
        template: `
            <div>
                <div><${SEARCHFIELD_NAME} v-model="value" placeholder="placeholder"></${SEARCHFIELD_NAME}></div>
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
    }))
    .add('error state', () => ({
        template: `
            <div>
                <div><${SEARCHFIELD_NAME} v-model="value" :error="true" max-width="medium" error-message="these kinds of weird searches are not permitted..." label="What are you look for today ?"></${SEARCHFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: 'Something not work safe'
        })
    }))
    .add('valid state', () => ({
        template: `
            <div>
                <div><${SEARCHFIELD_NAME} v-model="value" :valid="true" max-width="medium" valid-message="370 billions results found" label="What are you look for today ?"></${SEARCHFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: 'Cats'
        })
    }));
