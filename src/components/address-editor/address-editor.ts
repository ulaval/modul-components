import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import Address, { AddressField, copyAddress, Country, CountryKey, Province } from '../../utils/address-lookup/address';
import { ModulVue } from '../../utils/vue/vue';
import { MDropdown } from '../dropdown/dropdown';
import { MTextfield } from '../textfield/textfield';
import WithRender from './address-editor.html';

@WithRender
@Component({
    components: {
        MTextfield,
        MDropdown
    }
})
export default class MAddressEditor extends ModulVue {
    @Model('change')
    readonly address: Address;

    @Prop({
        required: true,
        validator: (value: any) => value !== undefined
    })
    countries: Country[];

    @Prop({
        default: () => ([])
    })
    provinces: Province[];

    currentAddress: Address = copyAddress(this.address);

    @Watch('address')
    onAddressChange(): void {
        this.currentAddress = this.address;
        this.updateCountryCode(this.currentAddress[AddressField.COUNTRY][CountryKey.COUNTRY_ISO2]);
    }

    onBuildingNumberChange(value: string): void {
        this.updateValue(AddressField.BUILDING_NUMBER, value);
    }

    get buildingNumber(): string {
        return this.currentAddress.buildingNumber;
    }

    onStreetChange(value: string): void {
        this.updateValue(AddressField.STREET, value);
    }

    get street(): string {
        return this.currentAddress.street;
    }

    onSubBuildingChange(value: string): void {
        this.updateValue(AddressField.SUB_BUILDING, value);
    }

    get subBuilding(): string {
        return this.currentAddress.subBuilding;
    }

    onCountryChange(value: string): void {
        this.updateCountryValue(value);

    }

    get country(): string {
        return this.currentAddress.country.countryIso2;
    }

    onProvinceChange(value: string): void {
        this.updateProvinceValue(value);

    }

    get province(): string {
        return this.currentAddress.province.provinceCode;
    }

    onPostalCodeChange(value: string): void {
        this.updateValue(AddressField.POSTAL_CODE, value);
    }

    get postalCode(): string {
        return this.currentAddress.postalCode;
    }

    onCityChange(value: string): void {
        this.updateValue(AddressField.CITY, value);
    }

    get city(): string {
        return this.currentAddress.city;
    }

    @Emit('country-change')
    private updateCountryCode(_code: string): void { }

    @Emit('change')
    private updateAddress(_address: Address | Object): void { }

    private updateValue(field: string, value: string): void {
        if (this.currentAddress[field] !== undefined) {
            this.currentAddress[field] = value;
            this.updateAddress(this.currentAddress);
        }
    }

    private updateCountryValue(value: string): void {
        if (this.currentAddress[AddressField.COUNTRY] !== undefined) {
            const country: Country | undefined = this.countries.find((country: Country) => country.countryIso2 === value);
            if (country !== undefined) {
                this.currentAddress[AddressField.COUNTRY] = country;
                this.updateCountryCode(country.countryIso2);
                this.updateAddress(this.currentAddress);
            }
        }
    }

    private updateProvinceValue(value: string): void {
        if (this.currentAddress[AddressField.PROVINCE] !== undefined) {
            const province: Province | undefined = this.provinces.find((province: Province) => province.provinceCode === value);
            if (province !== undefined) {
                this.currentAddress[AddressField.PROVINCE] = province;
                this.updateAddress(this.currentAddress);
            }
        }
    }
}
