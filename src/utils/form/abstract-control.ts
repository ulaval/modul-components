import { ControlEditionContext } from './control-edition-context';
import { ControlError } from './control-error';
import { ControlOptions, FormControlOptions } from './control-options';
import { ControlValidatorValidationType } from './control-validator-validation-type';
import { FormArray } from './form-array';
import { FormGroup } from './form-group';
import { ControlValidationGuard, DefaultValidationGuard } from './validation-guard';
import { ControlValidator } from './validators/control-validator';

/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 */
export abstract class AbstractControl {
    public focusableElement: HTMLElement | undefined;
    protected readonly _validationGuard: ControlValidationGuard = DefaultValidationGuard;
    protected _parent: FormGroup | FormArray;
    protected _editionContext: ControlEditionContext = ControlEditionContext.None;
    protected _errors: ControlError[] = [];
    protected _waiting: boolean = false;
    protected _enabled: boolean = true;
    protected _readonly: boolean = false;
    protected _pristine: boolean = true;
    protected _touched: boolean = false;

    constructor(
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions | FormControlOptions<any>
    ) {
        if (options) {
            if (options.validationGuard) {
                this._validationGuard = options.validationGuard;
            }
        }
    }

    public abstract get value(): any;
    public abstract get valid(): boolean;
    public abstract get enabled(): boolean;
    public abstract set enabled(isEnabled: boolean);
    public abstract get waiting(): boolean;
    public abstract set waiting(isWaiting: boolean);
    public abstract get readonly(): boolean;
    public abstract set readonly(isReadonly: boolean);
    public abstract get pristine(): boolean;
    public abstract get touched(): boolean;

    public get errors(): ControlError[] {
        return this._errors;
    }

    public get errorMessage(): string {
        if (this.hasError()) {
            return this.errors[0].message;
        } else {
            return '';
        }
    }

    get parent(): FormGroup | FormArray {
        return this._parent;
    }

    set parent(parent: FormGroup | FormArray) {
        this._parent = parent;
    }

    public abstract hasError(): boolean;
    public abstract submit(external: boolean): Promise<void>;

    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this._editionContext = ControlEditionContext.None;
        this._errors = [];
    }

    public upwardValidationPropagation(): void {
        this.validate();
        this.validateAsync();

        if (!this._parent) {
            return;
        }

        this._parent.upwardValidationPropagation();
    }

    public validate(external: boolean = false): void {
        this.validators.map((v) => {
            if (
                v.async
                ||
                this._validationGuard(this._editionContext, v.validationType, external)
            ) {
                return;
            }

            const validationResult: Promise<boolean> | boolean | undefined = v.validationFunction(this);

            if (!(validationResult instanceof Promise)) {
                v.lastCheck = v.validationFunction(this) as boolean | undefined;
            } else {
                throw new Error('if you are using a async validation function  you must set the async flag to true');
            }
        });

        this._updateErrors();
    }

    public async validateAsync(external: boolean = false): Promise<void> {
        await Promise.all(
            this.validators
                .map(async (v) => {
                    if (
                        !v.async
                        ||
                        this._validationGuard(this._editionContext, v.validationType, external)
                    ) {
                        return;
                    }

                    const validationResult: Promise<boolean> | boolean | undefined = v.validationFunction(this);

                    if (validationResult instanceof Promise) {
                        this._waiting = true;

                        v.lastCheck = await v.validationFunction(this);

                        this._waiting = false;
                    } else {
                        throw new Error('Async validation function should return a Promise<boolan>');
                    }

                })
        );

        this._updateErrors();
    }

    public initEdition(): void {
        if (this.errors.length > 0) {
            this._editionContext = ControlEditionContext.HasErrors;
        } else if (this.pristine) {
            this._editionContext = ControlEditionContext.Pristine;
        } else {
            this._editionContext = ControlEditionContext.Dirty;
        }

        if (!this._parent) {
            return;
        }

        this._parent.initEdition();
    }

    public endEdition(): void {
        this._editionContext = ControlEditionContext.None;
        this._resetExternalValidators();

        this.validate();
        this.validateAsync();

        if (!this._parent) {
            return;
        }

        this._parent.endEdition();
    }

    protected _resetExternalValidators(): void {
        this.validators
            .filter(v => v.validationType === ControlValidatorValidationType.External)
            .forEach(v => {
                v.lastCheck = undefined;
                v.validationFunction = () => undefined;
            });

        this._updateErrors();
    }

    private _updateErrors(): void {
        this._errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }
}
