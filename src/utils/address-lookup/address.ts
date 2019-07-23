export default interface Address {
    buildingNumber: string;
    street: string;
    city: string;
    province?: Province;
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
    countryIso2: string;
}

export enum AddressField {
    BUILDING_NUMBER = 'buildingNumber',
    STREET = 'street',
    CITY = 'city',
    POSTAL_CODE = 'postalCode',
    SUB_BUILDING = 'subBuilding',
    COUNTRY = 'country',
    PROVINCE = 'province'
}

export enum ProvinceKey {
    PROVINCE = 'province',
    PROVINCE_CODE = 'provinceCode'
}

export enum CountryKey {
    COUNTRY = 'country',
    COUNTRY_ISO2 = 'countryIso2',
    COUNTRY_ISO3 = 'countryIso3'
}

export function copyAddress(source: Address): Address {
    const country: Country = { ...source.country };
    if (source.province !== undefined) {
        const province: Province = { ...source.province };
        return { ...source, province, country };
    } else {
        return { ...source, country };
    }
}
