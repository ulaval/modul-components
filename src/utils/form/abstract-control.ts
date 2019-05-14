import { BehaviorSubject } from 'rxjs';
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
    public focusGrantedObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    protected readonly _validationGuard: ControlValidationGuard = DefaultValidationGuard;
    protected _editionContext: ControlEditionContext = ControlEditionContext.None;
    protected _errors: ControlError[] = [];
    protected _waiting: boolean = false;
    protected _enabled: boolean = true;
    protected _readonly: boolean = false;
    protected _parent: FormGroup | FormArray;

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
    /** Pristine is when user has not changed it value */
    public abstract get pristine(): boolean;

    /** Touched is when the field is burred at leat one time  */
    public abstract get touched(): boolean;

    public abstract hasError(): boolean;

    public abstract initEdition(): void;
    public abstract endEdition(): void;
    public abstract updateValidity(): void;

    get parent(): FormGroup | FormArray {
        return this._parent;
    }

    setParent(parent: FormGroup | FormArray): void {
        this._parent = parent;
    }

    public get errors(): ControlError[] {
        return this._errors;
    }

    /**
     * Helper method to get the first error message, if any
     */
    public get errorMessage(): string {
        if (this.hasError()) {
            return this.errors[0].message;
        } else {
            return '';
        }
    }

    /**
     * Run all validatiors
     * @param external
     */
    public async validate(external: boolean = false): Promise<void> {
        await Promise.all(
            this.validators
                .map(async (v) => {
                    if (this._validationGuard(this._editionContext, v.validationType, external)) {
                        return;
                    }

                    v.lastCheck = await v.validationFunction(this);
                })
        );

        this._updateErrors();
    }

    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this._editionContext = ControlEditionContext.None;
        this._errors = [];
    }

    protected _resetManualValidators(): void {

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
