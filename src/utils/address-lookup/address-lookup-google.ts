import { FindResponse, ResponseMapper, RetrieveResponse, RetrieveResponseMapper } from './address-lookup-response-mapper';

export class GoogleFindResponse extends FindResponse {
    public request: google.maps.places.AutocompletionRequest | undefined;
    public result: google.maps.places.AutocompletePrediction | undefined;

    constructor() {
        super();
    }

    mapTo<TTo>(mapper: ResponseMapper<TTo>): TTo {
        return mapper.mapGoogle(this);
    }
}

export class GoogleFindResponseBuilder {
    private readonly specimen: GoogleFindResponse;

    constructor() {
        this.specimen = new GoogleFindResponse();
    }

    setRequest(request: google.maps.places.AutocompletionRequest): this {
        this.specimen.request = request;
        return this;
    }

    setResult(result: google.maps.places.AutocompletePrediction): this {
        this.specimen.result = result;
        return this;
    }

    build(): FindResponse {
        return this.specimen;
    }
}

export class GoogleRetrieveResponse extends RetrieveResponse {
    public request: google.maps.places.PlaceDetailsRequest | undefined;
    public result: google.maps.places.PlaceResult | undefined;

    constructor() {
        super();
    }

    mapTo<TTo>(mapper: RetrieveResponseMapper<TTo>): TTo {
        return mapper.mapGoogle(this);
    }
}

export class GoogleRetrieveResponseBuilder {
    private readonly specimen: GoogleRetrieveResponse;

    constructor() {
        this.specimen = new GoogleRetrieveResponse();
    }

    setRequest(request: google.maps.places.PlaceDetailsRequest): this {
        this.specimen.request = request;
        return this;
    }

    setResult(result: google.maps.places.PlaceResult): this {
        this.specimen.result = result;
        return this;
    }

    build(): RetrieveResponse {
        return this.specimen;
    }
}
