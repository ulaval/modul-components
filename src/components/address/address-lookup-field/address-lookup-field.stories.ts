import { storiesOf } from '@storybook/vue';
import { Address } from 'cluster';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { ADDRESS_LOOKUP_FIELD_NAME } from '../../component-names';
import AddressPlugin from '../address';

Vue.use(AddressPlugin, { loqateKey: '', googleKey: '' });

storiesOf(`${componentsHierarchyRootSeparator}/address/${ADDRESS_LOOKUP_FIELD_NAME}`, module)
    .add('default', () => ({
        data: () => ({
            origin: 'CA',
            language: 'fr',
            retrievedValue: 'nothing'
        }),
        methods: {
            onRetrieve(value: Address): void {
                (this as any).retrievedValue = value;
            }
        },
        template: `<div>
            current key is: {{ $addressLookup.key }}
            <${ADDRESS_LOOKUP_FIELD_NAME}
                :origin="origin"
                :language="language"
                @address-retrieved="onRetrieve">
            </${ADDRESS_LOOKUP_FIELD_NAME}>
            <div>RETRIEVED VALUE: {{ retrievedValue }}</div>
        </div>`
    }));
