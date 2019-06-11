import { AbstractControl } from '../abstract-control';
import { ControlError } from '../control-error';
import { ControlErrorImpl } from '../control-error-impl';
import { ControlValidatorValidationType } from '../control-validator-validation-type';
import { ControlValidator } from './control-validator';

/**
 * Implementaiton of a ControlValidator enabling setting the Error and the validation function.
 */
export class ControlValidatorImpl implements ControlValidator {
    constructor(public key: string,
        public validationFunction: (self: AbstractControl) => boolean | Promise<boolean> | undefined,
        public error: ControlError,
        public validationType: ControlValidatorValidationType,
        public lastCheck?: boolean,
        public async?: boolean) { }

    setError(message: string, groupMessage?: string): void {
        this.error = new ControlErrorImpl(message, groupMessage);
    }

    setValidationFunction(nouvelleValidationFunction: (self: AbstractControl) => boolean | Promise<boolean> | undefined): void {
        this.validationFunction = nouvelleValidationFunction;
    }
}

/**
 * Specific ControlValidator that is never in error and has no error message, of type External
 */
export class AlwayTrueExternalValidator extends ControlValidatorImpl {
    constructor(public key: string) {
        super(key, () => true, new ControlErrorImpl(''), ControlValidatorValidationType.External);
    }
}

/**
 * Specific ControlValidator that is always in error and has a custom error message, of type External
 */
export class AlwayFalseExternalValidator extends ControlValidatorImpl {
    constructor(public key: string, error: ControlError) {
        super(key, () => false, error, ControlValidatorValidationType.External);
    }
}

export class ControlValidatorOptionsImpl {
    constructor(public error?: ControlError, public validationType?: ControlValidatorValidationType) { }
}
