import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import AddressPlugin from '../../components/address/address';
import { ModulVue } from '../vue/vue';
import { Address, AddressSummary } from './address';
import WithRender from './address-lookup-service.sandbox.html';

@WithRender
@Component
export class MAddressLookupServiceSandbox extends ModulVue {

    addresses: AddressSummary[] = [];
    addressDrillDown: AddressSummary[] = [];

    addressDetail: Address[] = [];

    async created(): Promise<void> {
        // google places
        // ChIJk4jbBYqWuEwRAzro8GMtxY8 (quebec city)
        // ChIJU1hPyTOWuEwR9CZlgrb6v0w (325 rue des bouleaux o)

        // loqate
        // CA|CP|ENG|QC-QUÉBEC-RUE_DES_BOULEAUX_O-325
        // CA|CP|B|802889890

        this.addresses = await this.$addressLookup.find({ input: `2325 rue de l'Université` });

        this.addressDrillDown = await this.$addressLookup.find({
            id: 'ChIJk4jbBYqWuEwRAzro8GMtxY8',
            input: '325 rue des bouleaux o'
        });


        this.addressDetail = await this.$addressLookup.retrieve({
            id: 'ChIJU1hPyTOWuEwR9CZlgrb6v0w'
        }).catch(error => {
            console.error(error);
            return [];
        });
    }
}


const MAddressLookupServiceSandboxPlugin: PluginObject<any> = {
    install(v): void {
        v.use(AddressPlugin);
        v.component(`m-address-lookup-service-sandbox`, MAddressLookupServiceSandbox);
    }
};

export default MAddressLookupServiceSandboxPlugin;
