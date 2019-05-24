import axios from 'axios';
import { PluginObject } from 'vue';
import AddressLookupLoqateService, { LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, LoqateRetrieveResponse } from './address-lookup-loqate-service';
import AddressLookupService from './address-lookup-service';

declare module 'vue/types/vue' {
    interface Vue {
        $addressLookup: AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, LoqateRetrieveResponse>;
    }
}

export interface LoqateLicensePluginOptions {
    key: string;
}

export const LOQATE_LICENSE_KEY: string = 'm-loqate-license-key';

const AddressLookupPlugin: PluginObject<any> = {
    install(v, options: LoqateLicensePluginOptions | undefined = { key: '' }): void {
        if (!options.key) {
            v.prototype.$log.error('The API key for Loqate Web Service must be provided');
        }
        let addressLookup: AddressLookupLoqateService = new AddressLookupLoqateService(axios, options.key);
        v.prototype.$addressLookup = addressLookup;
    }
};

export default AddressLookupPlugin;
