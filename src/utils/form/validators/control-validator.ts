import { AbstractControl } from "../abstract-control";
import { ControlError } from "../control-error";

export interface ControlValidator {
    validationFunction: (self: AbstractControl) => boolean;
    error: ControlError;
    lastCheck?: boolean;
}
