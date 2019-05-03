import { AbstractControl } from "../abstract-control";
import { ControlError } from "../control-error";
import { ControlValidatorValidationType } from "../control-validator-validation-type";

export interface ControlValidator {
    key: string;
    validationFunction: (self: AbstractControl) => Promise<boolean> | undefined;
    error: ControlError;
    validationType: ControlValidatorValidationType;
    lastCheck?: boolean;
}

export interface ControlValidatorOptions {
    validationType?: ControlValidatorValidationType;
    error?: ControlError;
}
