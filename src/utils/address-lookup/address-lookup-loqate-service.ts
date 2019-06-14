import { AxiosInstance, AxiosResponse } from 'axios';
import Address from './address';
import AddressLookupService from './address-lookup-service';

interface LoqateFindResult {
    Items: LoqateFindItem[];
}

interface LoqateFindItem {
    Id: string;
    Type: string;
    Text: string;
    Highlight: string;
    Description: string;
}

interface LoqateFindRequest {
    Key: string;
    Text: string;
    Container?: string;
    Origin?: string;
    Language?: string;
}

interface LoqateRetriveResult {
    Items: LoqateRetrieveItem[];
}

interface LoqateRetrieveItem {
    Language: string;
    LanguageAlternatives: string;
    BuildingNumber: string;
    SubBuilding: string;
    Street: string;
    District: string;
    City: string;
    ProvinceName: string;
    ProvinceCode: string;
    PostalCode: string;
    CountryName: string;
    CountryIso2: string;
    CountryIso3: string;
    Label: string;
}


export interface LoqateFindQuery {
    id?: string;
    input: string;
    origin?: string;
    language?: string;
}

export interface LoqateFindResponse {
    id: string;
    text: string;
    userInput: string;
    description: string;
    type: string;
    highlight: string;
}

export interface LoqateRetrieveQuery {
    id: string;
}


export default class AddressLookupLoqateService implements AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, Address> {

    private axios: AxiosInstance;
    private key: string;

    constructor(axios: AxiosInstance, key: string) {
        this.axios = axios;
        this.key = key;
    }

    async find(query: LoqateFindQuery): Promise<LoqateFindResponse[]> {

        let params: LoqateFindRequest = {
            Key: this.key,
            Text: query.input,
            Container: (query.id) ? query.id : undefined,
            Origin: (query.origin) ? query.origin : undefined,
            Language: (query.language) ? query.language : undefined
        };

        const results: AxiosResponse<LoqateFindResult> = await this.axios.get(
            `https://api.addressy.com/Capture/Interactive/Find/v1.1/json3.ws`, {
                params
            }
        );

        return results.data.Items.map((row: LoqateFindItem) => ({
            id: row.Id,
            text: row.Text,
            description: row.Description,
            type: row.Type,
            userInput: params.Text,
            highlight: row.Highlight
        }));
    }

    async retrieve(query: LoqateRetrieveQuery): Promise<Address[]> {
        const results: AxiosResponse<LoqateRetriveResult> = await this.axios.get(
            `https://api.addressy.com/Capture/Interactive/Retrieve/v1/json3.ws`, {
                params: {
                    Id: query.id,
                    Key: this.key
                }
            }
        );

        return results.data.Items.map((row: LoqateRetrieveItem) => ({
            buildingNumber: row.BuildingNumber,
            street: row.Street,
            city: row.City,
            postalCode: row.PostalCode,
            province: {
                province: row.ProvinceName,
                provinceCode: row.ProvinceCode
            },
            country: {
                country: row.CountryName,
                countryIso2: row.CountryIso2
            },
            subBuilding: row.SubBuilding
        }));
    }
}
