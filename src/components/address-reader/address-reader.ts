import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Address from '../../utils/address-lookup/address';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './address-reader.html';

const BUILDING_NUMBER: string = 'buildingNumber';
const STREET: string = 'street';
const CITY: string = 'city';
const POSTAL_CODE: string = 'postalCode';
const SUB_BUILDING: string = 'subBuilding';
const COUNTRY: string = 'country';
const PROVINCE: string = 'province';

export interface DisplayableAddress {
    buildingNumber: string;
    street: string;
    city: string;
    postalCode: string;
    subBuilding: string;
    country: string;
    province: string;
}

export enum ProvinceKey {
    PROVINCE = 'province',
    PROVINCE_CODE = 'provinceCode'
}

export enum CountryKey {
    COUNTRY = 'country',
    COUNTRY_ISO2 = 'countryIso2',
    COUNTRY_ISO3 = 'countryIso3'
}

export type addressFieldFilter = (value: string) => string;
export type addressesFilters = { [field: string]: addressFieldFilter };

export interface AddressReaderProps {
    address: Address;
    filters: { [field: string]: addressFieldFilter };
    countryKey: CountryKey;
    provinceKey: ProvinceKey;
}

@WithRender
@Component
export class MAddressReader extends ModulVue implements AddressReaderProps {
    @Prop({
        required: true,
        validator: (value: any) => value !== undefined
    })
    address: Address;

    @Prop({ default: () => ({}) })
    filters: addressesFilters;

    @Prop({
        default: CountryKey.COUNTRY,
        validator: (value: string) => value === CountryKey.COUNTRY
            || value === CountryKey.COUNTRY_ISO2
            || value === CountryKey.COUNTRY_ISO3
    })
    countryKey: CountryKey;

    @Prop({
        default: ProvinceKey.PROVINCE,
        validator: (value: string) => value === ProvinceKey.PROVINCE
            || value === ProvinceKey.PROVINCE_CODE
    })
    provinceKey: ProvinceKey;

    get buildingNumber(): string {
        return this.filterString(BUILDING_NUMBER);
    }

    get street(): string {
        return this.filterString(STREET);
    }

    get city(): string {
        return this.filterString(CITY);
    }

    get postalCode(): string {
        return this.filterString(POSTAL_CODE);
    }

    get subBuilding(): string {
        return this.filterString(SUB_BUILDING);
    }

    get country(): string {
        return this.filterString(COUNTRY, this.countryKey);
    }

    get province(): string {
        return this.filterString(PROVINCE, this.provinceKey);
    }

    get filteredAddress(): DisplayableAddress {
        return {
            buildingNumber: this.buildingNumber,
            street: this.street,
            city: this.city,
            postalCode: this.postalCode,
            subBuilding: this.subBuilding,
            country: this.country,
            province: this.province
        };
    }

    private filterString(key: string, subKey: string = ''): string {
        let value: string = '';
        if (subKey !== '') {
            value = this.address[key][subKey];
        } else {
            value = this.address[key];
        }
        return (this.filters[key]) ? this.filters[key](value) : value;
    }
}
