import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param minLength The minimum length required to be valid. Bound included.
 * @param options options required to personnalise the validator, like the timing of the validation or the error messages to display.
 */
export const MinLengthValidator: (minLength: number, options?: ControlValidatorOptions) => ControlValidator = (minLength: number, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.MaxLength,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min length validator should not be attached to a form group');
            }

            let isMinLength: boolean;

            if (!control.value) {
                isMinLength = true;
            } else if (!isNaN(control.value)) {
                isMinLength = control.value.toString().length >= minLength;
            } else {
                isMinLength = control.value.length >= minLength;
            }

            return isMinLength;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:minLengthValidatorErrorMessage',
                    { minLength },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: options && options.controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:minLengthValidatorErrorSummaryMessage',
                        {
                            controlLabel: options.controlLabel,
                            minLength
                        },
                        undefined,
                        undefined,
                        undefined,
                        FormatMode.Sprintf)
                    : undefined
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Modification
    };
};
