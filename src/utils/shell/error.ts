import { AxiosError } from 'axios';

export class PromiseError extends Error {
    private _noPropagation: boolean = false;

    constructor(public error: Error) {
        super(error.message);
    }

    public get noPropagation(): boolean {
        return this._noPropagation;
    }

    public stopPropagation(): void {
        this._noPropagation = true;
    }
}

// export class PromiseJavascriptError extends PromiseError<Error> {

// }

// export class PromiseRestError extends PromiseError<AxiosError> {

// }
