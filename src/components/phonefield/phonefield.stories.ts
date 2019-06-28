import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { PHONEFIELD_NAME } from '../component-names';
import PhonefieldPlugin from './phonefield';

Vue.use(PhonefieldPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${PHONEFIELD_NAME}`, module)
    .add('default', () => ({
        data: () => ({
            model: '',
            country: {
                iso: 'ca',
                prefix: '1'
            }
        }),
        template: '<div><m-phonefield v-model="model" :country.sync="country"></m-phonefield><p>v-model = {{model}}</p><p>country selected = {{JSON.stringify(country)}}</p></div>'
    }))
    .add('disabled', () => ({
        template: '<m-phonefield :disabled="true"></m-phonefield>'
    }))
    .add('waiting', () => ({
        template: '<m-phonefield :waiting="true"></m-phonefield>'
    }))
    .add('error', () => ({
        template: '<m-phonefield :error="true"></m-phonefield>'
    }))
    .add('error message', () => ({
        template: '<m-phonefield :error="true" error-message="Error message"></m-phonefield>'
    }));
