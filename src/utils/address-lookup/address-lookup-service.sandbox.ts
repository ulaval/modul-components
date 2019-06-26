import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../vue/vue';
import Address from './address';
import { LoqateFindResponse } from './address-lookup-loqate-service';
import WithRender from './address-lookup-service.sandbox.html';

@WithRender
@Component
export class MAddressLookupServiceSandbox extends ModulVue {

    addresses: LoqateFindResponse[] = [];
    addressDrillDown: LoqateFindResponse[] = [];

    addressDetail: Address[] = [];

    async created(): Promise<void> {
        this.addresses = await this.$addressLookup.find({ input: `2325 rue de l'Université` });

        this.addressDrillDown = await this.$addressLookup.find({
            id: 'CA|CP|ENG|QC-QUÉBEC-RUE_DES_BOULEAUX_O-325',
            input: '325 rue des bouleaux o'
        });

        this.addressDetail = await this.$addressLookup.retrieve({
            id: 'CA|CP|B|5103540'
        });
    }
}


const MAddressLookupServiceSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-address-lookup-service-sandbox`, MAddressLookupServiceSandbox);
    }
};

export default MAddressLookupServiceSandboxPlugin;
