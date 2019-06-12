import { AbstractControl } from '../abstract-control';
import { ControlError } from '../control-error';
import { ControlValidatorValidationType } from '../control-validator-validation-type';

/**
 * Fields required for validators when working with FormGroup
 */
export interface ControlValidator {
    /**
     * Key used to retrieve the validator within the list of a given FormGroup
     */
    key: string;
    validationFunction: (self: AbstractControl) => boolean | Promise<boolean> | undefined;
    error: ControlError;
    validationType: ControlValidatorValidationType;
    lastCheck?: boolean;
    async?: boolean;
}

export interface ControlValidatorOptions {
    validationType?: ControlValidatorValidationType;
    error?: ControlError;
}
