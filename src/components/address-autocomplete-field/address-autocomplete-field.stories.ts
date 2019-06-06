import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { CountryKey, ProvinceKey } from '../address-reader/address-reader';
import { ADDRESS_AUTOCOMPLETE_FIELD_NAME } from '../component-names';
import MAddressAutocompleteField from './address-autocomplete-field';


storiesOf(`${componentsHierarchyRootSeparator}${ADDRESS_AUTOCOMPLETE_FIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        components: { MAddressAutocompleteField },
        data: () => ({
            address: {},
            props: {
                language: 'fr',
                origin: 'canada',
                filters: {
                    'street': (value: string) => value.charAt(0).toLowerCase() + value.slice(1)
                },
                countryKey: CountryKey.COUNTRY,
                provinceKey: ProvinceKey.PROVINCE_CODE
            }
        }),
        methods: {
            clear(): void {
                (this as any).address = {};
            }
        },
        template: `
        <div>
            <div>
                <${ADDRESS_AUTOCOMPLETE_FIELD_NAME} v-model="address" v-bind="props">
                </${ADDRESS_AUTOCOMPLETE_FIELD_NAME}>
            </div>
            <div style="border-top: 1px solid #000; margin-top: 50px;">Address from autocomplete field : {{ address }}</div>
            <div><a @click.prevent="clear">clear result</a></div>
        </div>`
    }));
