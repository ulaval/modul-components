import { ControlEditionContext } from "./control-edition-context";
import { ControlError } from "./control-error";
import { ControlOptions, FormControlOptions } from "./control-options";
import { ControlValidationType } from "./control-validation-type";
import { ControlValidationGuard, DefaultValidationGuard } from "./validation-guard";
import { ControlValidator } from "./validators/control-validator";

export abstract class AbstractControl {
    public focusGranted: boolean = false;
    protected readonly _validationType: ControlValidationType = ControlValidationType.OnGoing;
    protected readonly _validationGuard: ControlValidationGuard = DefaultValidationGuard;
    protected _editionContext: ControlEditionContext = ControlEditionContext.None;
    protected _errors: ControlError[] = [];

    constructor(
        public readonly name: string,
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions | FormControlOptions<any>
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

    public get errors(): ControlError[] {
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
        this._editionContext = ControlEditionContext.None;
        this._errors = [];
    }

    public abstract initEdition(): void;

    public endEdition(): void {
        this._editionContext = ControlEditionContext.None;
        this.validate();
    }
}
