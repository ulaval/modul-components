import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import Address, { AddressField, Country, Province } from '../../../utils/address-lookup/address';
import { ADDRESS_EDITOR_NAME } from '../../component-names';
import MAddressEditor, { AddressEditorValidator } from './address-editor';

const countries: Country[] = [
    { countryIso2: 'US', country: 'United-States of America' },
    { countryIso2: 'CA', country: 'Canada' },
    { countryIso2: 'VA', country: 'Vatican City' }
];

const provinces: { [countryIso2: string]: Province[] } = {
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
};

const validations: { [field: string]: AddressEditorValidator[] } = {
    [AddressField.BUILDING_NUMBER]: [
        (value: string, _context: Address) => (value === '') ? 'Building number is required.' : '',
        (value: string, _context: Address) => (isNaN(parseInt(value, 10))) ? 'Building number must be a numeric value.' : ''
    ],
    [AddressField.SUB_BUILDING]: [
        (value: string, _context: Address) => (value !== '' && isNaN(parseInt(value, 10))) ? 'Sub building number must be a numeric value.' : ''
    ],
    [AddressField.STREET]: [
        (value: string, _context: Address) => (value === '') ? 'Street is required.' : ''
    ],
    [AddressField.CITY]: [
        (value: string, _context: Address) => (value === '') ? 'City is required.' : ''
    ],
    [AddressField.POSTAL_CODE]: [
        (value: string, _context: Address) => (value === '') ? 'Postal code is required.' : ''
    ],
    [AddressField.COUNTRY]: [
        (value: string, _context: Address) => (value === '') ? 'Country is required.' : ''
    ],
    [AddressField.PROVINCE]: [
        (_value: string, context: Address, provinces: Province[]) => (context[AddressField.PROVINCE] === undefined && provinces.length > 0) ? 'Province is required' : ''
    ]
};

storiesOf(`${componentsHierarchyRootSeparator}/address/${ADDRESS_EDITOR_NAME}`, module)
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
            countries: countries,
            provincesList: provinces,
            currentProvinces: [],
            validations,
            isValid: true
        }),
        mounted(): void {
            this.onCountryChange(this.address.country.countryIso2);
        },
        methods: {
            onCountryChange(code: string): void {
                (this as any).currentProvinces = (this as any).provincesList[code];
            },
            onIsValid(isValid: boolean): void {
                (this as any).isValid = isValid;
            }
        },
        template: `
        <div>
            <div>
                <${ADDRESS_EDITOR_NAME} v-model='address'
                                        :countries='countries'
                                        :provinces='currentProvinces'
                                        :validations='validations'
                                        @country-change='onCountryChange'
                                        @is-valid='onIsValid'
                >
                </${ADDRESS_EDITOR_NAME}>
            </div>

            <div style='border-top: 1px solid #000; margin-top: 50px;'>
                <div>Current address valid : {{ isValid }}</div>
                <div>Address from editor : {{ address }}</div>
            </div>
        </div>`
    }))
    .add('empty address', () => ({
        components: { MAddressEditor },
        data: () => ({
            address: {
                buildingNumber: '',
                city: '',
                country: {
                    country: 'Canada',
                    countryIso2: 'CA'
                },
                province: undefined,
                street: '',
                postalCode: '',
                subBuilding: ''
            },
            countries: countries,
            provincesList: provinces,
            currentProvinces: [],
            validations
        }),
        mounted(): void {
            this.onCountryChange(this.address.country.countryIso2);
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
                                        :validations='validations'
                                        @country-change='onCountryChange'
                >
                </${ADDRESS_EDITOR_NAME}>
            </div>
            <div style='border-top: 1px solid #000; margin-top: 50px;'>Address from editor : {{ address }}</div>
        </div>`
    }));

