import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param min The minimum value required to be valid. Bound included.
 * @param controlLabel The label displayed to the user for the field. Used only with the default GroupMessage.
 * @param options
 */
export const MinValidator: (min: number, controlLabel?: string, options?: ControlValidatorOptions) => ControlValidator = (min: number, controlLabel?: string, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Min,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min validator should not be attached to a form group');
            }

            let isMin: boolean;

            if (!control.value && control.value !== 0) {
                isMin = true;
            } else {
                let value: number = control.value;
                isMin = value >= min;
            }

            return isMin;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:minValidatorErrorMessage',
                    { min },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:minValidatorErrorSummaryMessage',
                        {
                            controlLabel,
                            min
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
