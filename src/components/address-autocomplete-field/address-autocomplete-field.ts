import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import Address, { copyAddress, CountryKey, ProvinceKey } from '../../utils/address-lookup/address';
import { ModulVue } from '../../utils/vue/vue';
import { AddressLookupFieldProps, MAddressLookupField } from '../address-lookup-field/address-lookup-field';
import { addressesFilters, AddressReaderProps, MAddressReader } from '../address-reader/address-reader';
import { MInplaceEdit } from '../inplace-edit/inplace-edit';
import WithRender from './address-autocomplete-field.html';


export interface AddressLookupConfig extends AddressLookupFieldProps { }

export interface AddressReaderConfig extends AddressReaderProps { }

@WithRender
@Component({
    components: {
        MAddressLookupField,
        MAddressReader,
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

    @Prop() // value to take from address sub-object country
    readonly countryKey: CountryKey;

    @Prop() // value to take from address sub-object province
    readonly provinceKey: ProvinceKey;

    editing: boolean = false;
    error: string = '';
    editFormTitle: string = 'Edit address !translation';

    private current: Address = this.address;
    private editAddress: Address = this.address;

    @Watch('address')
    onAddressChange(): void {
        this.current = this.address;
    }

    onRetrieve(address: Address): void {
        this.current = address;
        this.updateAddress(this.current);
    }

    onConfirm(): void {
        this.updateAddress(this.editAddress);
        this.editing = false;
    }

    onCancel(): void {
        this.updateAddress(this.currentAddress);
        this.editing = false;
    }

    onClick(): void {
        this.editing = (this.editing) ? this.editing : !this.editing;
        if (this.editing) {
            this.editAddress = copyAddress(this.current);
        }
    }

    @Emit('change')
    private updateAddress(_address: Address | Object): void { }

    get currentAddress(): Address | Object {
        return this.current;
    }

    get addressFound(): boolean {
        return Object.keys(this.current).length > 0;
    }
}
