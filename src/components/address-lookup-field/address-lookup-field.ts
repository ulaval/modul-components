import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import AddressLookupPlugin from '../../utils/address-lookup/address-lookup.plugin';
import { ModulVue } from '../../utils/vue/vue';
import AutoCompletePlugin, { MAutoCompleteResult } from '../autocomplete/autocomplete';
import { ADDRESS_LOOKUP_FIELD_NAME } from '../component-names';
import WithRender from './address-lookup-field.html';

// tslint:disable: no-console
@WithRender
@Component
export class MAddressLookupField extends ModulVue {
    selection: string = '';

    currentResults: any[] = [];

    async onComplete(value: string): Promise<void> {
        this.currentResults = await this.$addressLookup.find({
            input: value
        });
    }

    get results(): MAutoCompleteResult[] {
        return this.currentResults.map(
            (row) => ({ label: row['text'], value: row['id'] }));
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
