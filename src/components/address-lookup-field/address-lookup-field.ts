import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { LoqateFindResponse, LoqateRetrieveResponse } from '../../utils/address-lookup/address-lookup-loqate-service';
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

    async onComplete(value: string): Promise<void> {
        this.currentResults = await this.fetchData(value);
    }

    async onSelect(id: string): Promise<void> {
        const currentAddress: LoqateFindResponse | undefined = this.currentResults.find((value: LoqateFindResponse) => value.id === id);
        if (currentAddress) {
            if (currentAddress.type !== KEY_ADDRESS_TYPE) {
                this.open = false;
                this.currentResults = await this.fetchData(currentAddress.userInput, id);
                this.open = true;
            } else {
                this.open = false;
            }
            if (currentAddress.type === KEY_ADDRESS_TYPE && this.selection === currentAddress.id) {
                const results: LoqateRetrieveResponse[] = await this.$addressLookup.retrieve({ id: currentAddress.id });
                if (results.length > 0) {
                    this.emitSelection(results[0]);
                }
            }
        }

    }

    @Emit('address-retrieved')
    private emitSelection(_currentAddress: LoqateRetrieveResponse): void {
    }

    get results(): MAutocompleteAddressResult[] {
        const data: MAutocompleteAddressResult[] = this.currentResults
            .map((row) => ({
                label: row['text'],
                value: row['id'],
                description: row['description'] ? this.formatHTMLDescription(row) : undefined,
                type: row['type'],
                classesToggle: {
                    'm-address-lookup-field__item--address': row['type'] === KEY_ADDRESS_TYPE,
                    'm-address-lookup-field__item--expandable': row['type'] !== KEY_ADDRESS_TYPE
                }
            }));
        return data;
    }

    private formatHTMLDescription(address: LoqateFindResponse): string {
        if (address.type === KEY_ADDRESS_TYPE) {
            return address.description;
        }
        const parts: string[] = address.description.split('-');
        if (parts.length === 1) {
            return parts[0];
        }
        const lastPart: string | undefined = parts.pop();
        if (!lastPart) {
            return '';
        }
        return parts.join('-') + ` - <em>${lastPart}</em>`;
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
