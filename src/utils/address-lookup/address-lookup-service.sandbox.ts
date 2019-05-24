import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../vue/vue';
import { LoqateFindResponse, LoqateRetrieveResponse } from './address-lookup-loqate-service';
import WithRender from './address-lookup-service.sandbox.html';
import AddressLookupPlugin from './address-lookup.plugin';

@WithRender
@Component
export class MAddressLookupServiceSandbox extends ModulVue {

    addresses: LoqateFindResponse[] = [];
    addressDrillDown: LoqateFindResponse[] = [];

    addressDetail: LoqateRetrieveResponse[] = [];

    async created(): Promise<void> {
        this.addresses = await this.$addressLookup.find({ text: '325 rue des bouleaux o' });

        this.addressDrillDown = await this.$addressLookup.find({
            id: 'CA|CP|ENG|QC-QUÉBEC-RUE_DES_BOULEAUX_O-325',
            text: '325 rue des bouleaux o'
        });

        this.addressDetail = await this.$addressLookup.retrieve({
            id: 'CA|CP|B|802920093'
        });
        // tslint:disable-next-line: no-console
        console.log(this.addressDetail);
    }
}


const MAddressLookupServiceSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AddressLookupPlugin, { key: process.env.LOQATE_KEY });
        v.component(`m-address-lookup-service-sandbox`, MAddressLookupServiceSandbox);
    }
};

export default MAddressLookupServiceSandboxPlugin;
