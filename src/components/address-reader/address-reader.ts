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
@WithRender
@Component
export class MAddressReader extends ModulVue {
    @Prop({
        required: true,
        validator: (value: any) => value !== undefined
    })
    address: Address;

    @Prop({ default: () => { } })
    filters: { [field: string]: (value: string) => string };

    @Prop({ default: 'country' })
    countryKey: string;

    @Prop({ default: 'province' })
    provinceKey: string;

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
