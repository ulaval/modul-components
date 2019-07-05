import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Address, { AddressField, CountryKey, ProvinceKey } from '../../../utils/address-lookup/address';
import { ModulVue } from '../../../utils/vue/vue';
import WithRender from './address-reader.html';

export interface DisplayableAddress {
    buildingNumber: string;
    street: string;
    city: string;
    postalCode: string;
    subBuilding: string;
    country: string;
    province: string;
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
        return this.filterString(AddressField.BUILDING_NUMBER);
    }

    get street(): string {
        return this.filterString(AddressField.STREET);
    }

    get city(): string {
        return this.filterString(AddressField.CITY);
    }

    get postalCode(): string {
        return this.filterString(AddressField.POSTAL_CODE);
    }

    get subBuilding(): string {
        return this.filterString(AddressField.SUB_BUILDING);
    }

    get country(): string {
        return this.filterString(AddressField.COUNTRY, this.countryKey);
    }

    get province(): string {
        return this.filterString(AddressField.PROVINCE, this.provinceKey);
    }

    get hasProvince(): boolean {
        return this.filterString(AddressField.PROVINCE, this.provinceKey).length > 0;
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
        if (subKey !== '' && this.address[key] && this.address[key][subKey]) {
            value = this.address[key][subKey];
        } else if (subKey === '' && this.address[key]) {
            value = this.address[key];
        }
        return (this.filters[key] && value.length > 0) ? this.filters[key](value) : value;
    }
}
