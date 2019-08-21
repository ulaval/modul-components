import { Address, AddressSources, AddressSummary } from './address';
import { GoogleFindResponse, GoogleRetrieveResponse } from './address-lookup-google';
import { LoqateFindResponse, LoqateRetrieveResponse } from './address-lookup-loqate';

const KEY_ADDRESS_TYPE: string = 'address';

enum GOOGLE_ADDRESS_COMPONENTS {
    STREER_NUMBER = 'street_number',
    ROUTE = 'route',
    LOCALITY = 'locality',
    POSTAL_CODE = 'postal_code',
    ADMINISTRATIVE_AREA = 'administrative_area_level_1',
    COUNTRY = 'country'
}

export abstract class FindResponse {
    abstract mapTo<TTo>(mapper: FindResponseMapper<TTo>): TTo;
}

export abstract class RetrieveResponse {
    abstract mapTo<TTo>(mapper: RetrieveResponseMapper<TTo>): TTo;
}

export interface ResponseMapper<TTo> {
    mapLoqate(response: LoqateFindResponse): TTo;
    mapGoogle(response: GoogleFindResponse): TTo;
}

export interface FindResponseMapper<TTo> {
    mapLoqate(response: LoqateFindResponse): TTo;
    mapGoogle(response: GoogleFindResponse): TTo;
}

export interface RetrieveResponseMapper<TTo> {
    mapLoqate(response: LoqateRetrieveResponse): TTo;
    mapGoogle(response: GoogleRetrieveResponse): TTo;
}

export class AddressLookupToAddressSummary implements FindResponseMapper<AddressSummary> {
    mapLoqate(response: LoqateFindResponse): AddressSummary {
        if (!response.request || !response.result) { return undefined!; }

        const type: string = (response.result.Type || '').toLocaleLowerCase();
        return {
            queryInput: response.request.Text,
            value: response.result.Id,
            type: type,
            label: response.result.Text,
            description: this.formatHTMLDescription(response)
        };
    }

    mapGoogle(response: GoogleFindResponse): AddressSummary {
        if (!response.request || !response.result) { return undefined!; }

        const type: string = KEY_ADDRESS_TYPE;
        return {
            queryInput: response.request.input,
            value: response.result.place_id,
            type: type,
            label: response.result.structured_formatting.main_text,
            description: response.result.structured_formatting.secondary_text
        };
    }

    private formatHTMLDescription(response: LoqateFindResponse): string {
        if (!response.request || !response.result) { return undefined!; }

        if ((response.result.Type || '').toLocaleLowerCase() === KEY_ADDRESS_TYPE) {
            return response.result.Description;
        }
        const parts: string[] = response.result.Description.split('-');
        if (parts.length === 1) {
            return parts[0];
        }
        const lastPart: string | undefined = parts.pop();
        if (!lastPart) {
            return '';
        }
        return parts + `<span class="m-address-lookup-field__results">${lastPart}</span>`;
    }
}

export class AddressRetrieveToAddress implements RetrieveResponseMapper<Address> {
    mapLoqate(response: LoqateRetrieveResponse): Address {
        if (!response.request || !response.result) { return undefined!; }

        return {
            name: '',
            buildingNumber: response.result.BuildingNumber,
            street: response.result.Street,
            city: response.result.City,
            postalCode: response.result.PostalCode,
            province: {
                province: response.result.ProvinceName,
                provinceCode: response.result.ProvinceCode
            },
            country: {
                country: response.result.CountryName,
                countryIso2: response.result.CountryIso2
            },
            subBuilding: response.result.SubBuilding,
            attributions: [],
            source: AddressSources.LOQATE,
            isEstablishment: false
        };
    }

    mapGoogle(response: GoogleRetrieveResponse): Address {
        // City name isn't correctly translated.
        // https://stackoverflow.com/questions/27567757/inconsistent-language-in-google-place-details-api
        // A workaround exists using textsearch.  Will try it at a later time.

        if (!response.request || !response.result) { return undefined!; }

        const componentsByType: { [key: string]: google.maps.GeocoderAddressComponent } = {
            [GOOGLE_ADDRESS_COMPONENTS.STREER_NUMBER]: { long_name: '', short_name: '', types: [] },
            [GOOGLE_ADDRESS_COMPONENTS.ROUTE]: { long_name: '', short_name: '', types: [] },
            [GOOGLE_ADDRESS_COMPONENTS.LOCALITY]: { long_name: '', short_name: '', types: [] },
            [GOOGLE_ADDRESS_COMPONENTS.POSTAL_CODE]: { long_name: '', short_name: '', types: [] },
            [GOOGLE_ADDRESS_COMPONENTS.ADMINISTRATIVE_AREA]: { long_name: '', short_name: '', types: [] },
            [GOOGLE_ADDRESS_COMPONENTS.COUNTRY]: { long_name: '', short_name: '', types: [] }
        };
        (response.result.address_components || []).forEach((component: google.maps.GeocoderAddressComponent) => {
            component.types.forEach((type: string) => {
                componentsByType[type] = component;
            });
        });

        return {
            buildingNumber: componentsByType[GOOGLE_ADDRESS_COMPONENTS.STREER_NUMBER].long_name,
            street: componentsByType[GOOGLE_ADDRESS_COMPONENTS.ROUTE].long_name,
            city: componentsByType[GOOGLE_ADDRESS_COMPONENTS.LOCALITY].long_name,
            postalCode: componentsByType[GOOGLE_ADDRESS_COMPONENTS.POSTAL_CODE].long_name,
            province: {
                province: componentsByType[GOOGLE_ADDRESS_COMPONENTS.ADMINISTRATIVE_AREA].long_name,
                provinceCode: componentsByType[GOOGLE_ADDRESS_COMPONENTS.ADMINISTRATIVE_AREA].short_name
            },
            country: {
                country: componentsByType[GOOGLE_ADDRESS_COMPONENTS.COUNTRY].long_name,
                countryIso2: componentsByType[GOOGLE_ADDRESS_COMPONENTS.COUNTRY].short_name
            },
            subBuilding: '',
            attributions: response.result.html_attributions || [],
            source: AddressSources.GOOGLE_PLACES,
            isEstablishment: !!(response.result.types || []).find((type: string) => type === 'establishment'),
            name: response.result.name
        };
    }
}
