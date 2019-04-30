import { AbstractControl } from "./abstract-control";
import { ControlEditionContext } from "./control-edition-context";
import { FormControlOptions } from "./control-options";
import { ControlValidator } from "./validators/control-validator";

export class FormControl<T> extends AbstractControl {
    private _value?: T;
    private _intialValue?: T;
    private _oldValue?: T;

    constructor(
        public readonly name: string,
        public readonly validators: ControlValidator[] = [],
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

    public initEdition(): void {
        if (this.errors.length > 0) {
            this._editionContext = ControlEditionContext.HasErrors;
        } else if (this._value === this._oldValue && this._value === this._intialValue) {
            this._editionContext = ControlEditionContext.Pristine;
        } else if (!this._value && this.isValid) {
            this._editionContext = ControlEditionContext.EmptyAndValid;
        } else if (this._value && this.isValid) {
            this._editionContext = ControlEditionContext.PopulateAndValid;
        }
    }

    public reset(): void {
        super.reset();
        this._value = this._oldValue = this._intialValue;
    }
}

