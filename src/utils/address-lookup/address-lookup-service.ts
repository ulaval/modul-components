
export default interface AddressLookupService<T> {
    find(address: string): Promise<AddressLookupResult<T>[]>;
    retrieve(query: AddressLookupRetrieveQuery<T>): AddressLookupResult<T>;
}

export interface AddressLookupResult<T> {
}

export interface AddressLookupRetrieveQuery<T> {
}
