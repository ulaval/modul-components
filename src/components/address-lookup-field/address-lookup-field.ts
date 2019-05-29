import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { LoqateFindResponse } from '../../utils/address-lookup/address-lookup-loqate-service';
import AddressLookupPlugin from '../../utils/address-lookup/address-lookup.plugin';
import { ModulVue } from '../../utils/vue/vue';
import AutoCompletePlugin from '../autocomplete/autocomplete';
import { ADDRESS_LOOKUP_FIELD_NAME } from '../component-names';
import WithRender from './address-lookup-field.html?style=./address-lookup-field.scss';

// tslint:disable: no-console
const KEY_ADDRESS_TYPE: string = 'address';
interface MAutocompleteAddressResult {
    value: string;
    type: string;
    label: string;
    htmlLabel?: string;
    description?: string;
    classesToggle?: { [className: string]: boolean };
}

@WithRender
@Component
export class MAddressLookupField extends ModulVue {

    // IP address, ISO2 or ISO3 country code for origin
    @Prop()
    origin: string | undefined;

    // Prefered language for results 2 or 4 chars fr, en, fr-ca, fr-fr, etc.
    @Prop()
    language: string | undefined;

    selection: string = '';

    open: boolean = false;

    currentResults: LoqateFindResponse[] = [];
    drilledAddress: { [id: string]: LoqateFindResponse[] } = {};
    childrenAddresses: string[] = [];
    parentAddresses: string[] = [];

    async onComplete(value: string): Promise<void> {
        this.currentResults = await this.fetchData(value);
    }

    async onSelect(id: string): Promise<void> {
        const currentAddress: LoqateFindResponse | undefined = this.currentResults.find((value: LoqateFindResponse) => value.id === id);
        if (currentAddress) {
            if (currentAddress.type !== KEY_ADDRESS_TYPE) {
                this.drilledAddress[id] = await this.fetchData(currentAddress.userInput, id);
                this.parentAddresses.push(id);
                Object.keys(this.drilledAddress).forEach((id: string) => {
                    const index: number = this.currentResults.findIndex((address: LoqateFindResponse) => address.id === id);
                    if (index >= 0) {
                        this.currentResults.splice(index + 1, 0, ...this.drilledAddress[id]);
                    }
                    this.childrenAddresses.push(
                        ...this.drilledAddress[id].reduce((acc: string[], address: LoqateFindResponse) => {
                            acc.push(address.id);
                            return acc;
                        }, [])
                    );
                });
                this.selection = this.currentResults[0].id;
                this.open = true;
            } else {
                this.open = false;
            }
        }
    }

    get results(): MAutocompleteAddressResult[] {
        const data: MAutocompleteAddressResult[] = this.currentResults
            .map((row) => ({
                label: row['text'],
                value: row['id'],
                description: row['description'] ? row['description'] : undefined,
                type: row['type'],
                classesToggle: {
                    'm-address-lookup-field__item--address': row['type'] === KEY_ADDRESS_TYPE,
                    'm-address-lookup-field__item--expandable': row['type'] !== KEY_ADDRESS_TYPE,
                    'm-address-lookup-field__item--expanded': !!this.parentAddresses.find((id: string) => row['id'] === id),
                    'm-address-lookup-field__item--children': !!this.childrenAddresses.find((id: string) => row['id'] === id)
                }
            }));
        console.log(data);
        this.drilledAddress = {};
        this.parentAddresses = [];
        this.childrenAddresses = [];
        return data;
    }

    private async fetchData(value: string, id?: string): Promise<LoqateFindResponse[]> {
        const addresses: LoqateFindResponse[] = await this.$addressLookup.find({
            input: value,
            id,
            origin: this.origin,
            language: this.language
        });
        return addresses.map((address: LoqateFindResponse) => {
            address.type = address.type.toLowerCase();
            return address;
        });
    }
}

const AddressLookupFieldPlugin: PluginObject<any> = {
    install(v, options): void {
        if (!Vue.prototype.$addressLookup) {
            v.use(AddressLookupPlugin, { key: process.env.LOQATE_KEY });
        }
        v.use(AutoCompletePlugin);
        v.component(ADDRESS_LOOKUP_FIELD_NAME, MAddressLookupField);
    }
};

export default AddressLookupFieldPlugin;
