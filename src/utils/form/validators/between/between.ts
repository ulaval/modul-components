import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param lowerBound Minimum value of the range within which the value must be to be valid. Inclusive.
 * @param upperBound Maximum value of the range within which the value must be to be valid. Inclusive.
 * @param options options required to personnalise the validator, like the timing of the validation or the error messages to display.
 */
export const BetweenValidator: (lowerBound: number, upperBound: number, options?: ControlValidatorOptions) => ControlValidator = (lowerBound: number, upperBound: number, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Between,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the between validator should not be attached to a form group');
            }

            let isBetween: boolean;

            if (!control.value && control.value !== 0) {
                isBetween = true;
            } else {
                let value: number | Date = control.value;

                isBetween = value >= lowerBound && value <= upperBound;
            }

            return isBetween;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:betweenValidatorErrorMessage',
                    {
                        lowerBound,
                        upperBound
                    },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: options && options.controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:betweenValidatorErrorSummaryMessage',
                        {
                            controlLabel: options.controlLabel,
                            lowerBound,
                            upperBound
                        },
                        undefined,
                        undefined,
                        undefined,
                        FormatMode.Sprintf)
                    : undefined
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Correction
    };
};
