import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 * Bound included
 */
export const MinValidator: Function = (controlLabel: string, min: number | Date, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Min,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min validator should not be attached to a form group');
            }

            let isMin: boolean;

            if (!control.value && control.value !== 0) {
                isMin = false;
            } else {
                let value: number | Date = control.value;

                if (min instanceof Date) {
                    value = new Date(control.value);
                }

                isMin = value >= min;
            }

            return isMin;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:minValidatorErrorMessage',
                    { min: min instanceof Date ? min.toLocaleDateString() : min },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: (ModulVue.prototype.$i18n).translate(
                    'm-form:minValidatorErrorSummaryMessage',
                    {
                        controlLabel,
                        min: min instanceof Date ? min.toLocaleDateString() : min
                    },
                    undefined, undefined, undefined, FormatMode.Sprintf
                )
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Correction
    };
};
