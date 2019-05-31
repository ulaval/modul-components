import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ADDRESS_READER } from '../component-names';
import { MAddressReader } from './address-reader';

storiesOf(`${componentsHierarchyRootSeparator}${ADDRESS_READER}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        components: { MAddressReader },
        data: () => ({
            address: {
                language: 'FRE',
                alternativeLanguages: ['FRE', 'ENG'],
                buildingNumber: '2325',
                city: 'Québec',
                country: {
                    country: 'Canada',
                    countryIso2: 'CA',
                    countryIso3: 'CAN'
                },
                province: {
                    province: 'Québec',
                    provinceCode: 'QC'
                },
                street: `Rue de l'Université`,
                postalCode: 'G1V 0A6',
                subBuilding: '',
                label: `2325 Rue de l'Université`
            },
            countryKey: 'country',
            provinceKey: 'provinceCode',
            filters: {
                street: (value: string): string => value.charAt(0).toLowerCase() + value.slice(1)
            }
        }),
        template: `<div>
            <${ADDRESS_READER}
                :address="address"
                :country-key="countryKey"
                :province-key="provinceKey"
                :filters="filters">
            </${ADDRESS_READER}>
        </div>`
    }))
    .add('Restructuring using scoped-slot', () => ({
        components: { MAddressReader },
        data: () => ({
            address: {
                language: 'FRE',
                alternativeLanguages: ['FRE', 'ENG'],
                buildingNumber: '2325',
                city: 'Québec',
                country: {
                    country: 'Canada',
                    countryIso2: 'CA',
                    countryIso3: 'CAN'
                },
                province: {
                    province: 'Québec',
                    provinceCode: 'QC'
                },
                street: `Rue de l'Université`,
                postalCode: 'G1V 0A6',
                subBuilding: '',
                label: `2325 Rue de l'Université`
            },
            countryKey: 'countryIso2',
            provinceKey: 'province',
            filters: {
                street: (value: string): string => value.charAt(0).toLowerCase() + value.slice(1)
            }
        }),
        template: `<div>
            <${ADDRESS_READER}
                :address="address"
                :country-key="countryKey"
                :province-key="provinceKey"
                :filters="filters"
                v-slot:default="{ filteredAddress }">
                {{ filteredAddress.postalCode }} <br />
                {{ filteredAddress.country }} <br />
                {{ filteredAddress.city }}, {{ filteredAddress.province }} <br />
                {{ filteredAddress.buildingNumber }} {{ filteredAddress.street }} <template v-if="filteredAddress.subBuilding !== ''">Appartement / bureau : {{ filteredAddress.subBuilding }} </template>
            </${ADDRESS_READER}>
        </div>`
    }));
