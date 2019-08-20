import { ModulVue } from '../vue/vue';

export default class GoogleAPI {
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

    promisifyFetch<TRequest, TResult>(fetchFunction: (request: TRequest, callback: (results: TResult, status: google.maps.places.PlacesServiceStatus) => void) => void, request: TRequest):
        Promise<TResult extends Array<any> ? TResult : TResult[]> {
        return new Promise(function(resolve: any, reject: any): void {
            fetchFunction(request, (results: TResult, status: google.maps.places.PlacesServiceStatus) => {
                const resultIsArray: boolean = results && (results as any).length !== undefined;
                const resultsAsArray: TResult[] = results && resultIsArray ? [...(results as unknown as TResult[])] : results ? [results] : [];

                switch (status) {
                    case google.maps.places.PlacesServiceStatus.ERROR:
                    case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
                    case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
                    case google.maps.places.PlacesServiceStatus.NOT_FOUND:
                    case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
                    case google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
                        return reject(`Google places API error: ${status}`);
                    case google.maps.places.PlacesServiceStatus.OK:
                    case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
                        return resolve(resultsAsArray);
                    default:
                        throw new Error('Unhandled google places service status');
                }
            });
        });
    }

    get placesAutocomplete(): Promise<google.maps.places.AutocompleteService> {
        return this.instance
            .then(() => {
                const service: google.maps.places.AutocompleteService = new google.maps.places.AutocompleteService();
                return {
                    getPlacePredictions: service.getPlacePredictions.bind(service),
                    getQueryPredictions: service.getQueryPredictions.bind(service)
                };
            });
    }

    get placesService(): Promise<google.maps.places.PlacesService> {
        return this.instance
            .then(() => {
                // the elements is never rendered in the DOM.  We have to show attributions manually after fetching an address.
                const element: HTMLDivElement = document.createElement('div');
                const service: google.maps.places.PlacesService = new google.maps.places.PlacesService(element);
                return {
                    findPlaceFromPhoneNumber: service.findPlaceFromPhoneNumber.bind(service),
                    findPlaceFromQuery: service.findPlaceFromQuery.bind(service),
                    getDetails: service.getDetails.bind(service),
                    nearbySearch: service.nearbySearch.bind(service),
                    radarSearch: undefined!, // radarSearch is deprecated so we don't need to wrap it.
                    textSearch: service.textSearch.bind(service)
                };
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

        const defaultLanguage: string | undefined = ModulVue.prototype.$i18n ? ModulVue.prototype.$i18n.currentLocale : undefined;
        const languageParam: string = defaultLanguage ? `&language=${defaultLanguage}` : '';
        // It's tricky to dynamically change google language at the moment.  https://stackoverflow.com/questions/20090711/google-map-dyanamic-language-change.
        // So if the language change, google language won't change.
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.key}${languageParam}&libraries=places&callback=${this.CALLBACK_NAME}`;
        script.onerror = this.rejectInitPromise;
        document.querySelector('head')!.appendChild(script);
    }
}
