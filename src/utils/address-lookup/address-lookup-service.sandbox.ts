import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../vue/vue';
import { Loqate } from './address-lookup-loqate-service';
import { AddressLookupResult } from './address-lookup-service';
import AddressLookupServicePlugin from './address-lookup-service.plugin';
import WithRender from './address-lookup-service.sandbox.html';

@WithRender
@Component
export class MAddressLookupServiceSandbox extends ModulVue {

    addresses: AddressLookupResult<Loqate>[] = [];

    async created(): Promise<void> {
        this.addresses = await this.$addressLookup.find('325 rue des bouleaux o');
    }
}


const MAddressLookupServiceSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AddressLookupServicePlugin);
        v.component(`m-address-lookup-service-sandbox`, MAddressLookupServiceSandbox);
    }
};

export default MAddressLookupServiceSandboxPlugin;
