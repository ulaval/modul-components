import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import Address, { AddressField, copyAddress, Country, CountryKey, Province } from '../../../utils/address-lookup/address';
import { ModulVue } from '../../../utils/vue/vue';
import { MDropdown } from '../../dropdown/dropdown';
import { MTextfield } from '../../textfield/textfield';
import WithRender from './address-editor.html';

export type AddressEditorValidator = (value?: string, context?: Address, provinces?: Province[]) => string;

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

    @Prop({ default: () => ({}) })
    validations: { [field: string]: AddressEditorValidator[] };

    i18nBuildingNumber: string = this.$i18n.translate('m-address-editor:building-number');
    i18nSubBuilding: string = this.$i18n.translate('m-address-editor:sub-building');
    i18nStreet: string = this.$i18n.translate('m-address-editor:street');
    i18nCity: string = this.$i18n.translate('m-address-editor:city');
    i18nCountry: string = this.$i18n.translate('m-address-editor:country');
    i18nProvince: string = this.$i18n.translate('m-address-editor:province');
    i18nPostalCode: string = this.$i18n.translate('m-address-editor:postal-code');


    currentAddress: Address = copyAddress(this.address);
    private errors: { [field: string]: string[] } = {
        [AddressField.BUILDING_NUMBER]: [],
        [AddressField.STREET]: [],
        [AddressField.SUB_BUILDING]: [],
        [AddressField.CITY]: [],
        [AddressField.PROVINCE]: [],
        [AddressField.COUNTRY]: [],
        [AddressField.POSTAL_CODE]: []
    };

    private touched: { [field: string]: boolean } = {
        [AddressField.BUILDING_NUMBER]: false,
        [AddressField.STREET]: false,
        [AddressField.SUB_BUILDING]: false,
        [AddressField.CITY]: false,
        [AddressField.PROVINCE]: false,
        [AddressField.COUNTRY]: false,
        [AddressField.POSTAL_CODE]: false
    };

    mounted(): void {
        this.isValid();
    }

    @Watch('address')
    onAddressChange(): void {
        this.currentAddress = this.address;
        this.updateCountryCode(this.currentAddress[AddressField.COUNTRY][CountryKey.COUNTRY_ISO2]);
    }

    @Watch('province')
    onProvincesChange(): void {
        this.validate(AddressField.PROVINCE);
    }

    onBuildingNumberChange(value: string): void {
        this.touched[AddressField.BUILDING_NUMBER] = true;
        this.validate(AddressField.BUILDING_NUMBER, value);
        this.updateValue(AddressField.BUILDING_NUMBER, value);
    }

    get buildingNumber(): string {
        return this.currentAddress.buildingNumber;
    }

    get buildingNumberHasError(): boolean {
        return !!this.errors[AddressField.BUILDING_NUMBER] && this.errors[AddressField.BUILDING_NUMBER].length > 0;
    }

    get buildingNumberNextError(): string {
        if (this.buildingNumberHasError) {
            return this.errors[AddressField.BUILDING_NUMBER][0];
        }
        return '';
    }

    onStreetChange(value: string): void {
        this.touched[AddressField.STREET] = true;
        this.validate(AddressField.STREET, value);
        this.updateValue(AddressField.STREET, value);
    }

    get street(): string {
        return this.currentAddress.street;
    }

    get streetHasError(): boolean {
        return !!this.errors[AddressField.STREET] && this.errors[AddressField.STREET].length > 0;
    }

    get streetNextError(): string {
        if (this.buildingNumberHasError) {
            return this.errors[AddressField.STREET][0];
        }
        return '';
    }

    onSubBuildingChange(value: string): void {
        this.touched[AddressField.SUB_BUILDING] = true;
        this.validate(AddressField.SUB_BUILDING, value);
        this.updateValue(AddressField.SUB_BUILDING, value);
    }

    get subBuilding(): string {
        return this.currentAddress.subBuilding;
    }

    get subBuildingHasError(): boolean {
        return !!this.errors[AddressField.SUB_BUILDING] && this.errors[AddressField.SUB_BUILDING].length > 0;
    }

    get subBuildingNextError(): string {
        if (this.subBuildingHasError) {
            return this.errors[AddressField.SUB_BUILDING][0];
        }
        return '';
    }

    onCountryChange(value: string): void {
        this.touched[AddressField.COUNTRY] = true;
        this.validate(AddressField.COUNTRY, value);
        if (this.currentAddress.country.countryIso2 !== value) {
            this.clearProvinceValue();
            this.onProvinceChange();
        }
        this.updateCountryValue(value);
        this.validate(AddressField.PROVINCE, value);
    }

    get country(): string {
        return this.currentAddress.country.countryIso2;
    }

    get countryHasError(): boolean {
        return !!this.errors[AddressField.COUNTRY] && this.errors[AddressField.COUNTRY].length > 0;
    }

    get countryNextError(): string {
        if (this.countryHasError) {
            return this.errors[AddressField.COUNTRY][0];
        }
        return '';
    }

    onProvinceChange(value?: string): void {
        this.touched[AddressField.PROVINCE] = true;
        this.validate(AddressField.PROVINCE, value);
        this.updateProvinceValue(value);
    }

    clearProvinceValue(): void {
        this.currentAddress.province = undefined;
    }

    get provinceHasError(): boolean {
        return !!this.errors[AddressField.PROVINCE] && this.errors[AddressField.PROVINCE].length > 0;
    }

    get provinceNextError(): string {
        if (this.provinceHasError) {
            return this.errors[AddressField.PROVINCE][0];
        }
        return '';
    }

    get province(): string {
        return (this.currentAddress.province) ? this.currentAddress.province.provinceCode : '';
    }

    onPostalCodeChange(value: string): void {
        this.touched[AddressField.POSTAL_CODE] = true;
        this.validate(AddressField.POSTAL_CODE, value);
        this.updateValue(AddressField.POSTAL_CODE, value);
    }

    get postalCode(): string {
        return this.currentAddress.postalCode;
    }

    get postalCodeHasError(): boolean {
        return !!this.errors[AddressField.POSTAL_CODE] && this.errors[AddressField.POSTAL_CODE].length > 0;
    }

    get postalCodeNextError(): string {
        if (this.postalCodeHasError) {
            return this.errors[AddressField.POSTAL_CODE][0];
        }
        return '';
    }

    onCityChange(value: string): void {
        this.touched[AddressField.CITY] = true;
        this.validate(AddressField.CITY, value);
        this.updateValue(AddressField.CITY, value);
    }

    get city(): string {
        return this.currentAddress.city;
    }

    get cityHasError(): boolean {
        return !!this.errors[AddressField.CITY] && this.errors[AddressField.CITY].length > 0;
    }

    get cityNextError(): string {
        if (this.cityHasError) {
            return this.errors[AddressField.CITY][0];
        }
        return '';
    }

    @Emit('country-change')
    private updateCountryCode(_code: string): void { }

    @Emit('change')
    private updateAddress(_address: Address | Object): void { }

    @Emit('is-valid')
    private updateIsValid(isValid: boolean): void { }

    private isValid(): void {
        this.updateIsValid(Object.keys(this.errors)
            .map((key: string) => this.errors[key].length)
            .reduce((acc: boolean, numberErrors: number) => (numberErrors > 0) ? false : acc, true));
    }

    private updateValue(field: string, value: string): void {
        if (this.currentAddress[field] !== undefined
            && (!this.errors[field]
                || (this.errors[field] && this.errors[field].length === 0))
        ) {
            this.currentAddress[field] = value;
            this.updateAddress(this.currentAddress);
        }
    }

    private updateCountryValue(value: string): void {
        if (this.currentAddress[AddressField.COUNTRY] !== undefined
            && (!this.errors[AddressField.COUNTRY]
                || (this.errors[AddressField.COUNTRY]
                    && this.errors[AddressField.COUNTRY].length === 0))
        ) {
            const country: Country | undefined = this.countries.find((country: Country) => country.countryIso2 === value);
            if (country !== undefined) {
                this.currentAddress[AddressField.COUNTRY] = country;
                this.updateCountryCode(country.countryIso2);
                this.updateAddress(this.currentAddress);
            }
        }
    }

    private updateProvinceValue(value?: string): void {
        const province: Province | undefined = this.provinces.find((province: Province) => province.provinceCode === value);
        this.currentAddress[AddressField.PROVINCE] = province;
        this.updateAddress(this.currentAddress);
        this.validate(AddressField.PROVINCE, '');
    }

    private validate(field: string, value?: string): void {
        if (this.validations[field]) {
            this.errors[field] = this.validations[field]
                .reduce((acc: string[], validation: AddressEditorValidator) => {
                    if (field === AddressField.PROVINCE) {
                        acc.push(validation(value, this.currentAddress, this.provinces));
                    } else {
                        acc.push(validation(value, this.currentAddress));
                    }
                    return acc;
                }, [])
                .filter((value) => value !== '');
        } else {
            this.errors[field] = [];
        }

        this.isValid();
    }
}
