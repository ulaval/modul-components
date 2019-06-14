import { AbstractControl } from '../abstract-control';
import { ControlError } from '../control-error';
import { ControlValidatorValidationType } from '../control-validator-validation-type';

/**
 * Fields required for validators when working with FormGroup
 */
export interface ControlValidator {
    /**
     * (Optional) Key used to retrieve the validator within the list of a given FormGroup
     */
    key?: string;
    validationFunction: (self: AbstractControl) => boolean | Promise<boolean> | undefined;
    error: ControlError;
    validationType: ControlValidatorValidationType;
    lastCheck?: boolean;
    async?: boolean;
}

export interface ControlValidatorOptions {
    validationType?: ControlValidatorValidationType;
    /**
     * Contains the string to be displayed to the user when the field is invalid
     */
    error?: ControlError;
    /**
     * The label displayed to the user for the field. Used only with the default GroupMessage.
     */
    controlLabel?: string;
}
