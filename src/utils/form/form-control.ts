import { AbstractControl } from './abstract-control';
import { FormControlOptions } from './control-options';
import { ControlValidatorValidationType } from './control-validator-validation-type';
import { ControlValidator } from './validators/control-validator';

export class FormControl<T> extends AbstractControl {
    private _value?: T;
    private _initialValue?: T;
    private _oldValue?: T;

    constructor(
        public readonly validators: ControlValidator[] = [],
        options?: FormControlOptions<T>
    ) {
        super(validators, options);

        if (options) {
            this._initialValue = this._value = this._oldValue = options.initialValue;
        } else {
            // ensure reactivity
            this._value = undefined;
        }
    }

    public get touched(): boolean {
        return this._touched;
    }

    get value(): T | undefined {
        return this._value;
    }

    set value(value: T | undefined) {
        if (value === this.value && typeof value !== 'object') {
            return;
        }

        this._oldValue = this._value;
        this._value = value;

        this.upwardValueChanged();
    }

    public get valid(): boolean {
        if (!this.enabled || this.readonly) {
            return true;
        } else {
            return this.validators
                .filter(v => v.validationType !== ControlValidatorValidationType.External)
                .every(v => !!v.lastCheck);
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
    }

    public get waiting(): boolean {
        return this._waiting;
    }

    public set waiting(isWaiting: boolean) {
        this._waiting = isWaiting;
    }

    public get readonly(): boolean {
        return this._readonly;
    }

    public set readonly(isReadonly: boolean) {
        this._readonly = isReadonly;
    }

    public endEdition(): void {
        this._touched = true;
        super.endEdition();
    }

    public reset(): void {
        super.reset();
        this._touched = false;
        this._value = this._oldValue = this._initialValue;
    }

    public async submit(external: boolean = false): Promise<void> {
        this.validate(external);
        await this.validateAsync(external);
    }
}
