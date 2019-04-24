import { AbstractControlEditionContext } from "./abstract-control-edition-context";
import { AbstractControlError } from "./abstract-control-error";
import { AbstractControlOptions, FormControlOptions } from "./abstract-control-options";
import { AbstractControlValidationType } from "./abstract-control-validation-type";
import { AbstractControlValidator } from "./abstract-control-validator";
import { AbstractControlValidationGuard, DefaultValidationGuard } from "./validation-guard";

export abstract class AbstractControl {
    public focusGranted: boolean = false;
    protected readonly _validationType: AbstractControlValidationType = AbstractControlValidationType.OnGoing;
    protected readonly _validationGuard: AbstractControlValidationGuard = DefaultValidationGuard;
    protected _editionContext: AbstractControlEditionContext = AbstractControlEditionContext.None;
    protected _errors: AbstractControlError[] = [];

    constructor(
        public readonly name: string,
        public readonly validators: AbstractControlValidator[] = [],
        options?: AbstractControlOptions | FormControlOptions<any>
    ) {
        if (options) {
            if (options.validationType) {
                this._validationType = options.validationType;
            }

            if (options.validationGuard) {
                this._validationGuard = options.validationGuard;
            }
        }
    }

    public abstract get isValid(): boolean;

    public get errors(): AbstractControlError[] {
        return this._errors;
    }

    public validate(): void {
        if (this._validationGuard(this._editionContext, this._validationType)) {
            return;
        }

        this.validators.forEach(v => v.lastCheck = v.validationFunction(this));
        this._errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }

    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this._editionContext = AbstractControlEditionContext.None;
        this._errors = [];
    }

    public abstract initEdition(): void;

    public endEdition(): void {
        this._editionContext = AbstractControlEditionContext.None;
        this.validate();
    }
}
