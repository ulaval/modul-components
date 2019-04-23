import { AbstractControlValidationType } from "./abstract-control-validation-type";
import { AbstractControlValidationGuard } from "./validation-guard";

export interface AbstractControlOptions {
    validationType?: AbstractControlValidationType;
    validationGuard?: AbstractControlValidationGuard;
}

export interface FormControlOptions<T> extends AbstractControlOptions {
    initialValue?: T;
}
