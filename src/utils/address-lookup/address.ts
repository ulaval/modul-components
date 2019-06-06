export default interface Address {
    buildingNumber: string;
    street: string;
    city: string;
    province: Province;
    postalCode: string;
    country: Country;
    subBuilding: string;
}

export interface Province {
    provinceCode: string;
    province: string;
}

export interface Country {
    country: string;
    countryIso2?: string;
    countryIso3?: string;
}


export function copyAddress(source: Address): Address {
    const country: Country = { ...source.country };
    const province: Province = { ...source.province };
    return { ...source, province, country };
}
