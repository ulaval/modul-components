import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import Address, { AddressField, copyAddress, Country, CountryKey, Province, ProvinceKey } from '../../../utils/address-lookup/address';
import { ModulVue } from '../../../utils/vue/vue';
import { MInplaceEdit } from '../../inplace-edit/inplace-edit';
import MAddressEditor, { AddressEditorValidator } from '../address-editor/address-editor';
import { AddressLookupFieldProps, MAddressLookupField } from '../address-lookup-field/address-lookup-field';
import { addressesFilters, AddressReaderProps, MAddressReader } from '../address-reader/address-reader';
import WithRender from './address-autocomplete-field.html';


export interface AddressLookupConfig extends AddressLookupFieldProps { }

export interface AddressReaderConfig extends AddressReaderProps { }
@WithRender
@Component({
    components: {
        MAddressLookupField,
        MAddressReader,
        MAddressEditor,
        MInplaceEdit
    }
})
export default class MAddressAutocompleteField extends ModulVue implements AddressLookupConfig, AddressReaderConfig {

    @Model('change')
    readonly address: Address;

    @Prop() // used by the lookup field to determine default response language
    readonly language: string;

    @Prop() // used by the lookup field to determine origine for the query
    readonly origin: string;

    @Prop() // filters to apply when displaying address
    readonly filters: addressesFilters;

    @Prop() // value to use from address sub-object country
    readonly countryKey: CountryKey;

    @Prop() // value to use from address sub-object province
    readonly provinceKey: ProvinceKey;

    @Prop() // list of countries for use in dropdown of edit form
    readonly countries: Country[];

    @Prop()// list of provinces for use in dropdown of edit form
    readonly provinces: { [countryIso2: string]: Province[] };

    @Prop({ default: () => ({}) }) // validators to apply on form
    readonly validations: { [field: string]: AddressEditorValidator[] };

    editAddress: Address = this.address;

    editing: boolean = false;
    error: string = '';
    editFormTitle: string = 'Edit address !translation';
    currentProvinces: Province[] = [];

    private current: Address = copyAddress(this.address);
    private canSubmit: boolean = true;

    mounted(): void {
        if (this.address && this.address.country) {
            this.onCountryChange(this.address.country.countryIso2);
        }
    }

    @Watch('address')
    onAddressChange(): void {
        this.current = copyAddress(this.address);
        if (this.current && this.current.country) {
            this.onCountryChange(this.current.country.countryIso2);
        }
    }

    onRetrieve(address: Address): void {
        this.current = address;
        this.updateAddress(this.current);
    }

    onConfirm(): void {
        if (this.canSubmit) {
            this.updateAddress(this.editAddress);
            this.current = copyAddress(this.editAddress);
            this.editing = false;
        }
    }

    onCancel(): void {
        this.updateAddress(this.currentAddress);
        this.editing = false;
    }

    onClick(): void {
        if (!this.editing) {
            this.editAddress = copyAddress(this.current);
        }
        this.editing = (this.editing) ? this.editing : !this.editing;
    }

    onIsValid(value: boolean): void {
        this.canSubmit = value;
    }

    onCountryChange(code: string): void {
        this.currentProvinces = this.provinces[code];
    }

    @Emit('change')
    private updateAddress(_address: Address | Object): void { }

    get currentAddress(): Address | Object {
        return this.current;
    }

    get hasValue(): boolean {
        return Object.keys(this.current).map((key: string) => key !== AddressField.COUNTRY && this.current[key] !== '' && this.current[key] !== undefined)
            .reduce((acc: boolean, data: boolean) => (data) ? data : acc, false);
    }
}
