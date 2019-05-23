import axios from 'axios';
import AddressLookupLoqateService, { Loqate } from './address-lookup-loqate-service';
import AddressLookupService from './address-lookup-service';

it(`will use loqate`, async () => {
    const service: AddressLookupService<Loqate> = new AddressLookupLoqateService(axios);
    const response: any = await service.find('325 rue des bouleaux Ouest');
    expect(response).toBe({});
});
