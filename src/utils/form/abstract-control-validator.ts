import { AbstractControl } from "./abstract-control";
import { AbstractControlError } from "./abstract-control-error";

export interface AbstractControlValidator {
    validationFunction: (self: AbstractControl) => boolean;
    error: AbstractControlError;
    lastCheck?: boolean;
}
