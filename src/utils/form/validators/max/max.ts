import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param min The maximum value required to be valid. Bound included.
 * @param controlLabel The label displayed to the user for the field. Used only with the default GroupMessage.
 * @param options
 */
export const MaxValidator: (max: number, controlLabel?: string, options?: ControlValidatorOptions) => ControlValidator = (max: number, controlLabel?: string, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Max,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            }

            let isMax: boolean;

            if (!control.value && control.value !== 0) {
                isMax = true;
            } else {
                let value: number = control.value;

                isMax = value <= max;
            }

            return isMax;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:maxValidatorErrorMessage',
                    { max },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:maxValidatorErrorSummaryMessage',
                        {
                            controlLabel,
                            max
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
