import { Address, AddressSummary } from './address';


export interface AddressLookupService {
    find(query: AddressLookupFindQuery): Promise<AddressSummary[]>;
    retrieve(query: AddressLookupRetrieveQuery): Promise<Address[]>;
}

export interface AddressLookupFindQuery {
    id?: string;
    input: string;
    origin?: string;
    language?: string;
}

export interface AddressLookupRetrieveQuery {
    id: string;
}
