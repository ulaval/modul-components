import { AbstractControlEditionContext } from "./abstract-control-edition-context";
import { AbstractControlError } from "./abstract-control-error";
import { AbstractControlValidationType } from "./abstract-control-validation-type";
import { AbstractControlValidator } from "./abstract-control-validator";
import { AbstractControlValidationGuard, DefaultValidationGuard } from "./validation-guard";

export abstract class AbstractControl {
    public editionContext: AbstractControlEditionContext = AbstractControlEditionContext.None;
    public focusGranted: boolean = false;
    protected _errors: AbstractControlError[] = [];

    constructor(
        public readonly name: string,
        public readonly validators: AbstractControlValidator[] = [],
        public readonly validationType: AbstractControlValidationType = AbstractControlValidationType.OnGoing,
        private readonly _guardAgainstValidation: AbstractControlValidationGuard = DefaultValidationGuard
    ) { }

    public abstract get isValid(): boolean;
    public abstract get errors(): AbstractControlError[];

    public validate(): void {
        if (this._guardAgainstValidation(this.editionContext, this.validationType)) {
            return;
        }

        this.validators.forEach(v => v.lastCheck = v.validationFunction(this));
        this._errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }


    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this.editionContext = AbstractControlEditionContext.None;
        this._errors = [];
    }

    public abstract initEdition(): void;

    public endEdition(): void {
        this.editionContext = AbstractControlEditionContext.None;
        this.validate();
    }
}
