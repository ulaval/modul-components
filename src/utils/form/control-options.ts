import { ControlValidationType } from "./control-validation-type";
import { ControlValidationGuard } from "./validation-guard";

export interface ControlOptions {
    validationType?: ControlValidationType;
    validationGuard?: ControlValidationGuard;
}

export interface FormControlOptions<T> extends ControlOptions {
    initialValue?: T;
}
