export class PromiseError {
    private _noPropagation: boolean = false;

    constructor(public error: Error) {
    }

    public get noPropagation(): boolean {
        return this._noPropagation;
    }

    public stopPropagation(): void {
        this._noPropagation = true;
    }
}
