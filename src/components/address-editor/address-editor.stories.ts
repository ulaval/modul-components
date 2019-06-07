import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ADDRESS_EDITOR_NAME } from '../component-names';
import MAddressEditor from './address-editor';


storiesOf(`${componentsHierarchyRootSeparator}${ADDRESS_EDITOR_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        components: { MAddressEditor },
        data: () => ({
            address: {
                buildingNumber: '2325',
                city: 'Québec',
                country: {
                    country: 'Canada',
                    countryIso2: 'CA'
                },
                province: {
                    province: 'Québec',
                    provinceCode: 'QC'
                },
                street: `Rue de l'Université`,
                postalCode: 'G1V 0A6',
                subBuilding: ''
            },
            countries: [
                { countryIso2: 'US', country: 'United-States of America' },
                { countryIso2: 'CA', country: 'Canada' },
                { countryIso2: 'VA', country: 'Vatican City' }
            ],
            provincesList: {
                'US': [
                    { provinceCode: 'AL', province: 'Alabama' },
                    { provinceCode: 'AK', province: 'Alaska' },
                    { provinceCode: 'AS', province: 'American Samoa' },
                    { provinceCode: 'AZ', province: 'Arizona' },
                    { provinceCode: 'AR', province: 'Arkansas' },
                    { provinceCode: 'CA', province: 'California' },
                    { provinceCode: 'CO', province: 'Colorado' },
                    { provinceCode: 'CT', province: 'Connecticut' },
                    { provinceCode: 'DE', province: 'Delaware' },
                    { provinceCode: 'DC', province: 'District Of Columbia' },
                    { provinceCode: 'FM', province: 'Federated States Of Micronesia' },
                    { provinceCode: 'FL', province: 'Florida' },
                    { provinceCode: 'GA', province: 'Georgia' },
                    { provinceCode: 'GU', province: 'Guam' },
                    { provinceCode: 'HI', province: 'Hawaii' },
                    { provinceCode: 'ID', province: 'Idaho' },
                    { provinceCode: 'IL', province: 'Illinois' },
                    { provinceCode: 'IN', province: 'Indiana' },
                    { provinceCode: 'IA', province: 'Iowa' },
                    { provinceCode: 'KS', province: 'Kansas' },
                    { provinceCode: 'KY', province: 'Kentucky' },
                    { provinceCode: 'LA', province: 'Louisiana' },
                    { provinceCode: 'ME', province: 'Maine' },
                    { provinceCode: 'MH', province: 'Marshall Islands' },
                    { provinceCode: 'MD', province: 'Maryland' },
                    { provinceCode: 'MA', province: 'Massachusetts' },
                    { provinceCode: 'MI', province: 'Michigan' },
                    { provinceCode: 'MN', province: 'Minnesota' },
                    { provinceCode: 'MS', province: 'Mississippi' },
                    { provinceCode: 'MO', province: 'Missouri' },
                    { provinceCode: 'MT', province: 'Montana' },
                    { provinceCode: 'NE', province: 'Nebraska' },
                    { provinceCode: 'NV', province: 'Nevada' },
                    { provinceCode: 'NH', province: 'New Hampshire' },
                    { provinceCode: 'NJ', province: 'New Jersey' },
                    { provinceCode: 'NM', province: 'New Mexico' },
                    { provinceCode: 'NY', province: 'New York' },
                    { provinceCode: 'NC', province: 'North Carolina' },
                    { provinceCode: 'ND', province: 'North Dakota' },
                    { provinceCode: 'MP', province: 'Northern Mariana Islands' },
                    { provinceCode: 'OH', province: 'Ohio' },
                    { provinceCode: 'OK', province: 'Oklahoma' },
                    { provinceCode: 'OR', province: 'Oregon' },
                    { provinceCode: 'PW', province: 'Palau' },
                    { provinceCode: 'PA', province: 'Pennsylvania' },
                    { provinceCode: 'PR', province: 'Puerto Rico' },
                    { provinceCode: 'RI', province: 'Rhode Island' },
                    { provinceCode: 'SC', province: 'South Carolina' },
                    { provinceCode: 'SD', province: 'South Dakota' },
                    { provinceCode: 'TN', province: 'Tennessee' },
                    { provinceCode: 'TX', province: 'Texas' },
                    { provinceCode: 'UT', province: 'Utah' },
                    { provinceCode: 'VT', province: 'Vermont' },
                    { provinceCode: 'VI', province: 'Virgin Islands' },
                    { provinceCode: 'VA', province: 'Virginia' },
                    { provinceCode: 'WA', province: 'Washington' },
                    { provinceCode: 'WV', province: 'West Virginia' },
                    { provinceCode: 'WI', province: 'Wisconsin' },
                    { provinceCode: 'WY', province: 'Wyoming' }
                ],
                'CA': [
                    { provinceCode: 'AB', province: 'Alberta' },
                    { provinceCode: 'BC', province: 'British Columbia' },
                    { provinceCode: 'MB', province: 'Manitoba' },
                    { provinceCode: 'NB', province: 'New Brunswick' },
                    { provinceCode: 'NL', province: 'Newfoundland and Labrador' },
                    { provinceCode: 'NS', province: 'Nova Scotia' },
                    { provinceCode: 'NT', province: 'Northwest Territories' },
                    { provinceCode: 'NU', province: 'Nunavut' },
                    { provinceCode: 'ON', province: 'Ontario' },
                    { provinceCode: 'PE', province: 'Prince Edward Island' },
                    { provinceCode: 'QC', province: 'Québec' },
                    { provinceCode: 'SK', province: 'Saskatchewan' },
                    { provinceCode: 'YT', province: 'Yukon' }
                ],
                'VA': []
            },
            currentProvinces: []
        }),
        mounted(): void {
            this.onCountryChange(this.address.country.countryIso2);
            // tslint:disable-next-line: no-console
            console.log(this.currentProvinces);
        },
        methods: {
            onCountryChange(code: string): void {
                (this as any).currentProvinces = (this as any).provincesList[code];
            }
        },
        template: `
        <div>
            <div>
                <${ADDRESS_EDITOR_NAME} v-model='address'
                                        :countries='countries'
                                        :provinces='currentProvinces'
                                        @country-change='onCountryChange'
                >
                </${ADDRESS_EDITOR_NAME}>
            </div>
            <div style='border-top: 1px solid #000; margin-top: 50px;'>Address from editor : {{ address }}</div>
        </div>`
    }));
