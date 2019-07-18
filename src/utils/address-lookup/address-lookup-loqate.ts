import { FindResponse, FindResponseMapper, RetrieveResponse, RetrieveResponseMapper } from './address-lookup-response-mapper';
import { LoqateFindItem, LoqateFindRequest, LoqateRetrieveItem, LoqateRetrieveRequest } from './typings-loqate';

export class LoqateFindResponse extends FindResponse {
    public request: LoqateFindRequest | undefined;
    public result: LoqateFindItem | undefined;

    constructor() {
        super();
    }

    mapTo<TTo>(mapper: FindResponseMapper<TTo>): TTo {
        return mapper.mapLoqate(this);
    }
}

export class LoqateFindResponseBuilder {
    private readonly specimen: LoqateFindResponse;

    constructor() {
        this.specimen = new LoqateFindResponse();
    }

    setRequest(request: LoqateFindRequest): this {
        this.specimen.request = request;
        return this;
    }

    setResult(result: LoqateFindItem): this {
        this.specimen.result = result;
        return this;
    }

    build(): FindResponse {
        return this.specimen;
    }
}

export class LoqateRetrieveResponse extends RetrieveResponse {
    public request: LoqateRetrieveRequest | undefined;
    public result: LoqateRetrieveItem | undefined;

    constructor() {
        super();
    }

    mapTo<TTo>(mapper: RetrieveResponseMapper<TTo>): TTo {
        return mapper.mapLoqate(this);
    }
}

export class LoqateRetrieveResponseBuilder {
    private readonly specimen: LoqateRetrieveResponse;

    constructor() {
        this.specimen = new LoqateRetrieveResponse();
    }

    setRequest(request: LoqateRetrieveRequest): this {
        this.specimen.request = request;
        return this;
    }

    setResult(result: LoqateRetrieveItem): this {
        this.specimen.result = result;
        return this;
    }

    build(): RetrieveResponse {
        return this.specimen;
    }
}
