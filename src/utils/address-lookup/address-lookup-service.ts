import Address from './address';

export default interface AddressLookupService<T, U extends FindResponse, V, W extends Address> {
    find(query: T): Promise<U[]>;
    retrieve(query: V): Promise<W[]>;
}

export interface FindResponse {
    text: string;
}

export interface RetrieveResponse extends Address {
    label: string;
}
