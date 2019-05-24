
export default interface AddressLookupService<T, U, V, W> {
    find(address: T): Promise<U[]>;
    retrieve(query: V): Promise<W[]>;
}
