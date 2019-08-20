
import { AxiosInstance } from 'axios';
import { Address, AddressSummary } from './address';
import { AddressLookupFindQuery, AddressLookupRetrieveQuery, AddressLookupService } from './address-lookup';
import { GoogleFindResponseBuilder, GoogleRetrieveResponseBuilder } from './address-lookup-google';
import { AddressLookupToAddressSummary, AddressRetrieveToAddress } from './address-lookup-response-mapper';
import GoogleAPI from './google-api';

export default class AddressLookupGoogleService implements AddressLookupService {
    private readonly googleAPI: GoogleAPI;
    private sessionToken?: google.maps.places.AutocompleteSessionToken;

    constructor(private axios: AxiosInstance, private key: string) {
        this.googleAPI = new GoogleAPI(this.key);
    }

    async find(query: AddressLookupFindQuery): Promise<AddressSummary[]> {
        await this.ensureCreateToken();
        const request: google.maps.places.AutocompletionRequest = {
            input: query.input,
            sessionToken: this.sessionToken
        };

        const results: google.maps.places.AutocompletePrediction[] = await this.googleAPI.promisifyFetch((await this.googleAPI.placesAutocomplete).getPlacePredictions, request);
        return results
            .map((prediction: google.maps.places.AutocompletePrediction) => new GoogleFindResponseBuilder()
                .setRequest(request)
                .setResult(prediction)
                .build()
                .mapTo(new AddressLookupToAddressSummary()));
    }

    async retrieve(query: AddressLookupRetrieveQuery): Promise<Address[]> {
        await this.ensureCreateToken();
        const request: google.maps.places.PlaceDetailsRequest = {
            placeId: query.id,
            sessionToken: this.sessionToken
        };

        const results: google.maps.places.PlaceResult[] = await this.googleAPI.promisifyFetch((await this.googleAPI.placesService).getDetails, request);
        this.discardToken();
        return results
            .map((prediction: google.maps.places.PlaceResult) => new GoogleRetrieveResponseBuilder()
                .setRequest(request)
                .setResult(prediction)
                .build()
                .mapTo(new AddressRetrieveToAddress()));
    }

    private async ensureCreateToken(): Promise<void> {
        const token: google.maps.places.AutocompleteSessionToken = !this.sessionToken ? await this.googleAPI.createToken() : this.sessionToken;
        this.sessionToken = token;
    }

    private discardToken(): void {
        // The moment at which the token should be discarded is still unclear.  It might get moved later.
        this.sessionToken = undefined;
    }
}
