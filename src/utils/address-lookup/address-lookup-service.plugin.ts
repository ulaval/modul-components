import axios from 'axios';
import { PluginObject } from 'vue';
import AddressLookupLoqateService, { Loqate } from './address-lookup-loqate-service';
import AddressLookupService from './address-lookup-service';

declare module 'vue/types/vue' {
    interface Vue {
        $addressLookup: AddressLookupService<Loqate>;
    }
}

const AddressLookupServicePlugin: PluginObject<any> = {
    install(v): void {
        let addressLookup: AddressLookupLoqateService = new AddressLookupLoqateService(axios, 'AA11-AA11-AA11-AA11');
        v.prototype.$addressLookup = addressLookup;
    }
};

export default AddressLookupServicePlugin;
