import { AxiosInstance, AxiosResponse } from 'axios';
import Address from './address';
import AddressLookupService, { AddressLookupResult, AddressLookupRetrieveQuery } from './address-lookup-service';

export default class AddressLookupLoqateService implements AddressLookupService<Loqate> {

    private axios: AxiosInstance;
    private key: string;

    constructor(axios: AxiosInstance, key: string) {
        this.axios = axios;
        this.key = key;
    }

    async find(address: string): Promise<AddressLookupResult<Loqate>[]> {
        const results: AxiosResponse<any[]> = await this.axios.get(
            `https://api.addressy.com/Capture/Interactive/Find/v1.1/json3.ws?Key=${this.key}&Text=${address}`
        );
        // tslint:disable-next-line: no-console
        console.log(results);
        return results.data.Items.map((row) => ({
            id: row['Id'],
            text: row['Text'],
            description: row['Description'],
            type: row['Type'],
            userInput: address
        }));
    }

    retrieve(query: AddressLookupRetrieveQuery<Loqate>): AddressLookupResult<Loqate> {
        throw new Error("Method not implemented.");
    }
}

export interface Loqate extends Address {
    id: string;
    text: string;
    userInput: string;
    description: string;
    type: string;
}
