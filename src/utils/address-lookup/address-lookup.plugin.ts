import axios from 'axios';
import { PluginObject } from 'vue';
import Address from './address';
import AddressLookupLoqateService, { LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery } from './address-lookup-loqate-service';
import AddressLookupService from './address-lookup-service';

declare module 'vue/types/vue' {
    interface Vue {
        $addressLookup: AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, Address>;
    }
}

export interface AddressLookupPluginOptions {
    loqateKey: string;
}

export const LOQATE_LICENSE_KEY: string = 'm-loqate-license-key';

const AddressLookupPlugin: PluginObject<any> = {
    install(v, options: AddressLookupPluginOptions | undefined = { loqateKey: '' }): void {
        if (!options.loqateKey) {
            v.prototype.$log.error('The API key for Loqate Web Service must be provided');
        }
        let addressLookup: AddressLookupLoqateService = new AddressLookupLoqateService(axios, options.loqateKey);
        v.prototype.$addressLookup = addressLookup;
    }
};

export default AddressLookupPlugin;
