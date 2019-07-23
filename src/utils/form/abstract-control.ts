import { getString } from '../str/str';
import { ControlEditionContext } from './control-edition-context';
import { ControlError } from './control-error';
import { ControlOptions, FormControlOptions } from './control-options';
import { FormArray } from './form-array';
import { FormGroup } from './form-group';
import { ControlValidationGuard, DefaultValidationGuard } from './validation-guard';
import { ControlValidator } from './validators/control-validator';

/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 */
export abstract class AbstractControl<T = any> {
    public htmlElementAccessor: () => HTMLElement | undefined = () => undefined;
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

    public abstract get value(): T;
    public abstract set value(value: T);
    public abstract get valid(): boolean;
    public abstract get enabled(): boolean;
    public abstract set enabled(isEnabled: boolean);
    public abstract get waiting(): boolean;
    public abstract set waiting(isWaiting: boolean);
    public abstract get readonly(): boolean;
    public abstract set readonly(isReadonly: boolean);
    public abstract get touched(): boolean;
    public abstract get controls(): AbstractControl[];
    public abstract getControl<T = any>(name: string): AbstractControl<T>;
    public abstract get errors(): ControlError[];
    public abstract set errors(errors: ControlError[]);
    public abstract get errorsDeep(): ControlError[];

    public get htmlElement(): HTMLElement | undefined {
        return this.htmlElementAccessor();
    }

    public get pristine(): boolean {
        return this._pristine;
    }

    public hasError(): boolean {
        return this.errors.length > 0;
    }

    public hasErrorDeep(): boolean {
        return this.errorsDeep.length > 0;
    }

    public get errorMessage(): string {
        if (this.hasErrorDeep()) {
            return getString(this.errorsDeep[0].message);
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

    public abstract submit(): Promise<void>;

    public reset(): void {
        this._pristine = true;
        this.validators.forEach(v => v.lastCheck = undefined);
        this._editionContext = ControlEditionContext.None;
        this.errors = [];
    }

    public upwardValueChanged(): void {
        this._pristine = false;

        if (!this._hasAnyControlsInError() && this.enabled && !this.readonly) {
            this.validate();
        }

        if (this._parent) {
            this._parent.upwardValueChanged();
        }
    }

    public validate(): void {
        this.validators.map(v => {
            if (
                v.async
                ||
                this._validationGuard(this._editionContext, v.validationType)
            ) {
                return;
            }

            const validationResult: Promise<boolean> | boolean = v.validationFunction(this);

            if (!(validationResult instanceof Promise)) {
                v.lastCheck = v.validationFunction(this) as boolean;
            } else {
                throw new Error('if you are using a async validation function  you must set the async flag to true');
            }
        });

        this._updateErrors();
    }

    public async validateAsync(): Promise<void> {
        await Promise.all(
            this.validators
                .map(async (v) => {
                    if (
                        !v.async
                        ||
                        this._validationGuard(this._editionContext, v.validationType)
                    ) {
                        return;
                    }

                    const validationResult: Promise<boolean> | boolean = v.validationFunction(this);

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
        if (!this.enabled || this.readonly) {
            return;
        }

        if (this.errors.length > 0) {
            this._editionContext = ControlEditionContext.HasErrors;
        } else if (this.pristine) {
            this._editionContext = ControlEditionContext.Pristine;
        } else {
            this._editionContext = ControlEditionContext.Dirty;
        }

        if (this._parent) {
            this._parent.initEdition();
        }
    }

    public endEdition(): void {
        if (!this.enabled || this.readonly) {
            return;
        }

        this._editionContext = ControlEditionContext.None;
        this._updateErrors();

        if (!this.pristine && !this._hasAnyControlsInError()) {
            this.validate();
            this.validateAsync();
        }

        if (this._parent) {
            this._parent.endEdition();
        }
    }

    private _updateErrors(): void {
        this.errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }

    protected _hasAnyControlsInError(): boolean {
        return false;
    }
}
