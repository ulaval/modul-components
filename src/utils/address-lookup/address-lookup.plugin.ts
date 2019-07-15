import axios from 'axios';
import { PluginObject } from 'vue';
import Address from './address';
import AddressLookupGoogleService from './address-lookup-google-service';
import AddressLookupLoqateService, { LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery } from './address-lookup-loqate-service';
import AddressLookupService from './address-lookup-service';

declare module 'vue/types/vue' {
    interface Vue {
        $addressLookup: AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, Address>;
    }
}

export interface AddressLookupPluginOptions {
    loqateKey: string;
    googleKey: string;
}

const AddressLookupPlugin: PluginObject<any> = {
    install(v, options: AddressLookupPluginOptions | undefined = { loqateKey: '', googleKey: '' }): void {
        if ((!options.loqateKey && !options.googleKey) || (options.loqateKey && options.googleKey)) {
            v.prototype.$log.error('The API key for Loqate Web Service OR Google Maps API must be provided');
        }

        let addressLookup: AddressLookupGoogleService | AddressLookupLoqateService;
        if (options.googleKey) {
            addressLookup = new AddressLookupGoogleService(axios, options.googleKey);
        } else if (options.loqateKey) {
            addressLookup = new AddressLookupLoqateService(axios, options.loqateKey);
        } else {
            throw new Error('Unhandled addressLookup key.');
        }

        v.prototype.$addressLookup = addressLookup;
    }
};

export default AddressLookupPlugin;
