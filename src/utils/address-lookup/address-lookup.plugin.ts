import axios from 'axios';
import { PluginObject } from 'vue';
import { AddressLookupService } from './address-lookup';
import AddressLookupGoogleService from './address-lookup-google-service';
import AddressLookupLoqateService from './address-lookup-loqate-service';

declare module 'vue/types/vue' {
    interface Vue {
        $addressLookup: AddressLookupService;
    }
}

export interface AddressLookupPluginOptions {
    loqateKey: string;
    googleKey: string;
}

const AddressLookupPlugin: PluginObject<any> = {
    install(v, options: AddressLookupPluginOptions | undefined = { loqateKey: '', googleKey: '' }): void {
        if (options.loqateKey && options.googleKey) {
            v.prototype.$log.error('The API key for Loqate Web Service OR Google Maps API must be provided');
        }

        if (options.googleKey) {
            v.prototype.$log.error(`Address lookup using google shouldn't be used in prod yet.`);
        }

        let addressLookup: AddressLookupGoogleService | AddressLookupLoqateService | undefined = undefined;
        if (options.googleKey) {
            addressLookup = new AddressLookupGoogleService(axios, options.googleKey);
        } else if (options.loqateKey) {
            addressLookup = new AddressLookupLoqateService(axios, options.loqateKey);
        } else {
            v.prototype.$log.error(`You need to provide a Loqate Web Service or Google Maps API key.`);
        }

        v.prototype.$addressLookup = addressLookup;
    }
};

export default AddressLookupPlugin;
