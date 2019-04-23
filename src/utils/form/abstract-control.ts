/**
 * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
 */
export enum AbstractControlValidationType {
    Optimistic = 'optimistic',
    OnGoing = 'on-going',
    Correctable = 'correctable',
    AtExit = 'at-exit'
}

export enum AbstractControlEditionContext {
    None = 'none',
    EmptyAndValid = 'empty-and-valid',
    PopulateAndValid = 'populate-and-valid',
    NotValid = 'not-valid'
}

export interface AbstractControlError {
    key: string;
    message: string;
    summaryMessage?: string;
}

export interface AbstractControlValidator {
    validationFunction: (self: AbstractControl) => boolean;
    error: AbstractControlError;
    lastCheck?: boolean;
}

export abstract class AbstractControl {
    public editionContext: AbstractControlEditionContext = AbstractControlEditionContext.None;
    public focusGranted: boolean = false;
    protected _errors: AbstractControlError[] = [];

    constructor(
        public readonly name: string,
        public readonly validators: AbstractControlValidator[] = [],
        public readonly validationType: AbstractControlValidationType = AbstractControlValidationType.OnGoing
    ) { }

    public abstract get isValid(): boolean;
    public abstract get errors(): AbstractControlError[];

    public validate(): void {
        if (this.preventValidation()) {
            return;
        }

        this.validators.forEach(v => v.lastCheck = v.validationFunction(this));
        this._errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }


    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this.editionContext = AbstractControlEditionContext.None;
        this._errors = [];
    }

    public abstract initEdition(): void;

    public endEdition(): void {
        this.editionContext = AbstractControlEditionContext.None;
        this.validate();
    }

    protected abstract preventValidation(): boolean;
}
