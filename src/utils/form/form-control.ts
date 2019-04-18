
export interface AbstractControlOptions {
    validationType?: AbstractControlValidationType;
}

/**
 * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
 */
export enum AbstractControlValidationType {
    Optimistic = 'optimistic',
    OnGoing = 'on-going',
    Correctable = 'correctable',
    AtExit = 'at-exit'
}

export enum FormControlEditionContext {
    None = 'none',
    EmptyAndValid = 'empty-and-valid',
    PopulateAndValid = 'populate-and-valid',
    NotValid = 'not-valid'
}

export interface AbstractControlError {
    key: string;
    message: string;
}

export interface AbstractControlValidator {
    validationFunction: (self: AbstractControl) => boolean;
    error: AbstractControlError;
    lastCheck?: boolean;
}

export abstract class AbstractControl {
    public validationType: AbstractControlValidationType = AbstractControlValidationType.OnGoing;
    public editionContext: FormControlEditionContext;
    public errors: AbstractControlError[] = [];

    constructor(
        public name: string,
        public validators: AbstractControlValidator[] = []
    ) { }

    public abstract get isValid(): boolean;

    public validate(): void {
        if (this.preventValidation()) {
            return;
        }

        this.validators.forEach(v => v.lastCheck = v.validationFunction(this));
        this.errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }

    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this.errors = [];
    }

    public abstract initEdition(): void;

    public endEdition(): void {
        this.editionContext = FormControlEditionContext.None;
        this.validate();
    }

    protected abstract preventValidation(): boolean;
}

export class FormGroup extends AbstractControl {
    constructor(
        public name: string,
        public validators: AbstractControlValidator[] = [],
        public controls: AbstractControl[]
    ) {
        super(name, validators);
    }

    public get isValid(): boolean {
        return this.validators.every(v => !!v.lastCheck) && this.controls.every(c => c.isValid);
    }

    public getControl(name: string): AbstractControl {
        let control: AbstractControl | undefined = this.controls.find(c => c.name === name);

        if (!control) {
            throw Error(`There is no control with the name ${name} in this group`);
        }

        return control;
    }

    public addControl(control: AbstractControl): void {
        if (this.controls.find(c => c.name === control.name)) {
            throw Error(`There is already a control with name ${control.name} in this group`);
        }

        this.controls.push(control);
    }

    public removeControl(name: string): void {
        if (this.controls.find(c => c.name === name)) {
            throw Error(`There is no control with name ${name} in this group`);
        }

        this.controls = this.controls.filter(c => c.name === name);
    }

    public validate(): void {
        super.validate();
        this.controls.forEach(c => c.validate());
    }

    public initEdition(): void {
        if (
            !this.controls.filter(c => c instanceof FormControl).every((fc: FormControl<any>) => !!fc.value)
            &&
            this.isValid
        ) {
            this.editionContext = FormControlEditionContext.EmptyAndValid;
        } else if (
            this.controls.filter(c => c instanceof FormControl).every((fc: FormControl<any>) => !!fc.value)
            &&
            this.isValid
        ) {
            this.editionContext = FormControlEditionContext.PopulateAndValid;
        } else if (!this.isValid) {
            this.editionContext = FormControlEditionContext.NotValid;
        }
    }

    public reset(): void {
        super.reset();
        this.controls.forEach(c => c.reset());
    }

    protected preventValidation(): boolean {
        return true;
    }
}

export class FormControl<T> extends AbstractControl {
    private _intialValue?: T;

    constructor(
        public name: string,
        public validators: AbstractControlValidator[] = [],
        private _value?: T,
        options?: AbstractControlOptions
    ) {
        super(name, validators);

        this._intialValue = _value;

        if (options) {
            this.validationType = typeof options.validationType === undefined ?
                this.validationType : options.validationType!;
        }
    }

    get value(): T | undefined {
        return this._value;
    }

    set value(value: T | undefined) {
        this._value = value;
        this.validate();
    }

    public get isValid(): boolean {
        return this.validators.every(v => !!v.lastCheck);
    }

    public initEdition(): void {
        if (!this._value && this.isValid) {
            this.editionContext = FormControlEditionContext.EmptyAndValid;
        } else if (this._value && this.isValid) {
            this.editionContext = FormControlEditionContext.PopulateAndValid;
        } else if (!this.isValid) {
            this.editionContext = FormControlEditionContext.NotValid;
        }
    }

    public reset(): void {
        super.reset();
        this._value = this._intialValue;
    }

    protected preventValidation(): boolean {
        let preventValidation: boolean = true;

        if (this.editionContext === FormControlEditionContext.EmptyAndValid) {
            switch (this.validationType) {
                case AbstractControlValidationType.OnGoing:
                    preventValidation = false;
                    break;
            }
        } else if (this.editionContext === FormControlEditionContext.PopulateAndValid) {
            switch (this.validationType) {
                case AbstractControlValidationType.Optimistic:
                case AbstractControlValidationType.OnGoing:
                    preventValidation = false;
                    break;
            }
        } else if (this.editionContext === FormControlEditionContext.NotValid) {
            switch (this.validationType) {
                case AbstractControlValidationType.Optimistic:
                case AbstractControlValidationType.OnGoing:
                case AbstractControlValidationType.Correctable:
                    preventValidation = false;
                    break;
            }
        } else if (this.editionContext === FormControlEditionContext.None) {
            preventValidation = false;
        }

        return preventValidation;
    }
}

export default {

};

