import { AbstractControl } from "./abstract-control";
import { AbstractControlEditionContext } from "./abstract-control-edition-context";
import { AbstractControlError } from "./abstract-control-error";
import { AbstractControlValidationType } from "./abstract-control-validation-type";
import { AbstractControlValidator } from "./abstract-control-validator";

export class FormControl<T> extends AbstractControl {
    private _intialValue?: T;

    constructor(
        public readonly name: string,
        public readonly validationType: AbstractControlValidationType = AbstractControlValidationType.OnGoing,
        public readonly validators: AbstractControlValidator[] = [],
        private _value?: T
    ) {
        super(name, validators, validationType);

        this._intialValue = _value;
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

    public get errors(): AbstractControlError[] {
        return this._errors;
    }

    public initEdition(): void {
        if (!this._value && this.isValid) {
            this.editionContext = AbstractControlEditionContext.EmptyAndValid;
        } else if (this._value && this.isValid) {
            this.editionContext = AbstractControlEditionContext.PopulateAndValid;
        } else if (!this.isValid) {
            this.editionContext = AbstractControlEditionContext.NotValid;
        }
    }

    public reset(): void {
        super.reset();
        this._value = this._intialValue;
    }
}

