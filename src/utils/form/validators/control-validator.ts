import { AbstractControl } from '../abstract-control';
import { ControlError } from '../control-error';
import { ControlValidatorValidationType } from '../control-validator-validation-type';

export interface ControlValidator {
    key?: string;
    validationFunction: (self: AbstractControl) => boolean | Promise<boolean>;
    error: ControlError;
    validationType: ControlValidatorValidationType;
    lastCheck?: boolean;
    async?: boolean;
}

export interface ControlValidatorOptions {
    validationType?: ControlValidatorValidationType;
    error?: ControlError;
    controlLabel?: string;
}
