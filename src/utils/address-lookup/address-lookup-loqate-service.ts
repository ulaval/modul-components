import { AxiosInstance, AxiosResponse } from 'axios';
import { Address, AddressSummary } from './address';
import { AddressLookupFindQuery, AddressLookupRetrieveQuery, AddressLookupService } from './address-lookup';
import { LoqateFindResponseBuilder, LoqateRetrieveResponseBuilder } from './address-lookup-loqate';
import { AddressLookupToAddressSummary, AddressRetrieveToAddress } from './address-lookup-response-mapper';
import { LoqateFindItem, LoqateFindRequest, LoqateFindResult, LoqateRetrieveItem, LoqateRetrieveRequest, LoqateRetrieveResult } from './typings-loqate';

export default class AddressLookupLoqateService implements AddressLookupService {
    private axios: AxiosInstance;
    private key: string;

    constructor(axios: AxiosInstance, key: string) {
        this.axios = axios;
        this.key = key;
    }

    async find(query: AddressLookupFindQuery): Promise<AddressSummary[]> {
        let params: LoqateFindRequest = {
            Key: this.key,
            Text: query.input,
            Container: (query.id) ? query.id : undefined,
            Origin: (query.origin) ? query.origin : undefined,
            Language: (query.language) ? query.language : undefined
        };

        const results: AxiosResponse<LoqateFindResult> = await this.axios.get(
            `https://api.addressy.com/Capture/Interactive/Find/v1.1/json3.ws`, { params });

        return results.data.Items.map((row: LoqateFindItem) =>
            (new LoqateFindResponseBuilder()
                .setRequest(params)
                .setResult(row)
                .build()).mapTo(new AddressLookupToAddressSummary())
        );
    }

    async retrieve(query: AddressLookupRetrieveQuery): Promise<Address[]> {
        const params: LoqateRetrieveRequest = {
            Id: query.id,
            Key: this.key
        };
        const results: AxiosResponse<LoqateRetrieveResult> = await this.axios.get(
            `https://api.addressy.com/Capture/Interactive/Retrieve/v1/json3.ws`, { params });

        return results.data.Items.map((row: LoqateRetrieveItem) =>
            (new LoqateRetrieveResponseBuilder()
                .setRequest(params)
                .setResult(row)
                .build()).mapTo(new AddressRetrieveToAddress())
        );
    }
}
