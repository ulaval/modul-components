export default interface Address {
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
