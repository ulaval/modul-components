import { AbstractControl } from "./abstract-control";
import { AbstractControlEditionContext } from "./abstract-control-edition-context";
import { AbstractControlError } from "./abstract-control-error";
import { FormControlOptions } from "./abstract-control-options";
import { AbstractControlValidator } from "./abstract-control-validator";

export class FormControl<T> extends AbstractControl {
    private _value?: T;
    private _intialValue?: T;
    private _oldValue?: T;

    constructor(
        public readonly name: string,
        public readonly validators: AbstractControlValidator[] = [],
        options?: FormControlOptions<T>
    ) {
        super(name, validators, options);

        if (options) {
            this._intialValue = this._value = this._oldValue = options.initialValue;
        }
    }

    get value(): T | undefined {
        return this._value;
    }

    set value(value: T | undefined) {
        if (value === this._oldValue && typeof value !== 'object') {
            return;
        }

        this._oldValue = this._value;
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
        this._value = this._oldValue = this._intialValue;
    }
}

