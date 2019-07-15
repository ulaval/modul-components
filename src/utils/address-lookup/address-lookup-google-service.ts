import { AxiosInstance } from 'axios';
import { } from 'googlemaps';
import Address from './address';
import AddressLookupService from './address-lookup-service';

interface GoogleFindResult {
    // Items: LoqateFindItem[];
}

interface GoogleRetrieveQuery {

}

interface GoogleFindQuery {
    input: string;
    language?: string;
    origin?: string;
}

interface GoogleFindResponse {
    id: string;
    text: string;
    userInput: string;
    description: string;
    type: string;
    highlight: string;
}

export default class AddressLookupGoogleService implements
    AddressLookupService<GoogleFindQuery, GoogleFindResponse, GoogleRetrieveQuery, Address> {
    private readonly googleAPI: GoogleAPI;
    private sessionToken: google.maps.places.AutocompleteSessionToken;

    constructor(private axios: AxiosInstance, private key: string) {
        this.googleAPI = new GoogleAPI(this.key);
    }

    async find(query: GoogleFindQuery): Promise<GoogleFindResponse[]> {
        await this.ensureCreateToken();
        return new Promise<GoogleFindResponse[]>(async (resolve, reject) => {
            (await this.googleAPI.placesAutocomplete).getPlacePredictions({
                input: query.input,
                sessionToken: this.sessionToken
            }, (results: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {
                switch (status) {
                    case google.maps.places.PlacesServiceStatus.ERROR:
                    case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
                    case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
                    case google.maps.places.PlacesServiceStatus.NOT_FOUND:
                    case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
                    case google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
                        return reject({ results, status });
                    case google.maps.places.PlacesServiceStatus.OK:
                    case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
                        return resolve(this.transformAutocompletePredictions(query, results));
                    default:
                        throw new Error('Unhandled google places service status');
                }
            });
        });
    }

    retrieve(query: GoogleRetrieveQuery): Promise<Address[]> {
        throw new Error('Method not implemented.');
    }

    async ensureCreateToken(): Promise<void> {
        const token: google.maps.places.AutocompleteSessionToken = !this.sessionToken ? this.googleAPI.createToken() : this.sessionToken;
        this.sessionToken = token;
    }

    private transformAutocompletePredictions(query: GoogleFindQuery, predictions: google.maps.places.AutocompletePrediction[]): GoogleFindResponse[] {
        return predictions.map((prediction: google.maps.places.AutocompletePrediction) => ({
            id: prediction.place_id,
            text: prediction.structured_formatting.main_text,
            description: prediction.structured_formatting.secondary_text,
            type: '',
            userInput: query.input,
            highlight: ''
        }));
    }
}

// PlacesService
class GoogleAPI {
    private readonly CALLBACK_NAME: string = 'gmapsCallback';
    private resolveInitPromise;
    private rejectInitPromise;
    private readonly initPromise = new Promise((resolve, reject) => {
        this.resolveInitPromise = resolve;
        this.rejectInitPromise = reject;
    });

    private initialized: boolean = false;

    constructor(private key: string) {
        this.initialized = false;
    }

    private get instance(): Promise<any> {
        if (!this.initialized) {
            this.initialize();
        }

        return this.initPromise;
    }

    get placesAutocomplete(): Promise<google.maps.places.AutocompleteService> {
        return this.instance
            .then(() => {
                return new google.maps.places.AutocompleteService();
            });
    }

    createToken(): Promise<google.maps.places.AutocompleteSessionToken> {
        return this.instance
            .then(() => {
                return new google.maps.places.AutocompleteSessionToken();
            });
    }

    private initialize(): void {
        this.initialized = true;

        // The callback function is called by
        // the Google Maps script if it is
        // successfully loaded.
        window[this.CALLBACK_NAME] = () => this.resolveInitPromise((window as any).google.maps);

        // We inject a new script tag into
        // the `<head>` of our HTML to load
        // the Google Maps script.
        const script: HTMLScriptElement = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.key}&libraries=places&callback=${this.CALLBACK_NAME}`;
        script.onerror = this.rejectInitPromise;
        document.querySelector('head')!.appendChild(script);
    }
}
