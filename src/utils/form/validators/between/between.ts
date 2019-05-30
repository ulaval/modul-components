import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *  bounds included
 */
export const BetweenValidator: Function = (controlLabel: string, lowerBound: number, upperBound: number, options: ControlValidatorOptions): ControlValidator => {
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
                groupMessage: (ModulVue.prototype.$i18n).translate(
                    'm-form:betweenValidatorErrorSummaryMessage',
                    { controlLabel, lowerBound, upperBound },
                    undefined, undefined, undefined, FormatMode.Sprintf
                )
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Correction
    };
};
