import axios, { AxiosResponse } from 'axios';
import Address from './address';
import AddressLookupLoqateService, { LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery } from './address-lookup-loqate-service';
import AddressLookupService from './address-lookup-service';

jest.mock('axios');

axios.get = jest.fn();

const LOQATE_KEY: string = 'aa11-aa11-aa11-aa11';
const FIND_INPUT: string = `2325 rue de l'Université`;

const LOQATE_FIND_RESULTS: any = [
    {
        Id: 'first ID',
        Type: 'address',
        Text: FIND_INPUT,
        Highlight: '0-3',
        Description: 'address'
    },
    {
        Id: 'second ID',
        Type: 'building number',
        Text: FIND_INPUT,
        Highlight: '0-3',
        Description: 'address'
    }
];

const LOQATE_RETRIEVE_RESULTS: any = [
    {
        Language: 'FRE',
        LanguageAlternatives: 'FRE, ENG',
        BuildingNumber: 2325,
        SubBuilding: undefined,
        Street: `Rue de l'Université`,
        District: undefined,
        City: 'Québec',
        ProvinceName: 'Québec',
        ProvinceCode: 'QC',
        PostalCode: 'G1V 0A6',
        CountryName: 'Canada',
        CountryIso2: 'CA',
        CountryIso3: 'CAN',
        Label: `2325 Rue de l'Université,\n Québec,\n QC G1V 0A6`
    },
    {
        Language: 'ENG',
        LanguageAlternatives: 'FRE, ENG',
        BuildingNumber: 2325,
        SubBuilding: undefined,
        Street: `Street l'Université`,
        District: undefined,
        City: 'Québec',
        ProvinceName: 'Quebec',
        ProvinceCode: 'QC',
        PostalCode: 'G1V 0A6',
        CountryName: 'Canada',
        CountryIso2: 'CA',
        CountryIso3: 'CAN',
        Label: `2325 Rue de l'Université,\n Québec,\n QC G1V 0A6`
    }];


let service: AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, Address>;
describe(`Address lookup loqate service`, () => {
    beforeAll(() => {
        service = new AddressLookupLoqateService(axios, LOQATE_KEY);
    });

    describe('find', () => {
        beforeAll(() => {
            const response: AxiosResponse<any> = { data: { Items: LOQATE_FIND_RESULTS }, status: 200, statusText: 'success', headers: {}, config: {} };
            axios.get = jest.fn((url: string, params: any) => Promise.resolve(response));
        });

        it(`Searching for address will return parsed list`, async () => {
            const service: AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, Address> = new AddressLookupLoqateService(axios, LOQATE_KEY);

            const result: any = await service.find({ input: FIND_INPUT });

            expect(result).toEqual([
                {
                    'description': 'address', 'highlight': '0-3', 'id': 'first ID', 'text': `2325 rue de l'Université`,
                    'type': 'address', 'userInput': `2325 rue de l'Université`
                },
                {
                    'description': 'address', 'highlight': '0-3', 'id': 'second ID', 'text': `2325 rue de l'Université`,
                    'type': 'building number', 'userInput': `2325 rue de l'Université`
                }]);
        });
    });

    describe('retrieve', () => {
        beforeAll(() => {
            const response: AxiosResponse<any> = { data: { Items: LOQATE_RETRIEVE_RESULTS }, status: 200, statusText: 'success', headers: {}, config: {} };
            axios.get = jest.fn((url: string, params: any) => Promise.resolve(response));
        });

        it(`Searching for address will return parsed list`, async () => {
            const service: AddressLookupService<LoqateFindQuery, LoqateFindResponse, LoqateRetrieveQuery, Address> = new AddressLookupLoqateService(axios, LOQATE_KEY);

            const result: any = await service.retrieve({ id: 'first ID' });

            expect(result).toEqual([
                {
                    'buildingNumber': 2325, 'city': 'Québec',
                    'country': { 'country': 'Canada', 'countryIso2': 'CA' },
                    'postalCode': 'G1V 0A6',
                    'province': { 'province': 'Québec', 'provinceCode': 'QC' },
                    'street': `Rue de l'Université`, 'subBuilding': undefined
                },
                {
                    'buildingNumber': 2325, 'city': 'Québec',
                    'country': { 'country': 'Canada', 'countryIso2': 'CA' },
                    'postalCode': 'G1V 0A6', 'province': {
                        'province': 'Quebec',
                        'provinceCode': 'QC'
                    }, 'street': `Street l'Université`, 'subBuilding': undefined
                }]);
        });
    });
});
