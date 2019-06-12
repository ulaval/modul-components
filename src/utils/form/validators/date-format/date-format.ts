import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param controlLabel The label displayed to the user for the field. Used only with the default GroupMessage.
 * @param options
 */
export const DateFormatValidator: (controlLabel?: string, options?: ControlValidatorOptions) => ControlValidator = (controlLabel?: string, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Date,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the DateValidator should not be attached to a form group');
            }

            if (!control.value) {
                return true;
            } else {
                if (control.value.length < 10) {
                    return true;
                } else {
                    return !isNaN(Date.parse(control.value));
                }

            }

        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:dateFormatValidatorErrorMessage',
                    {
                        controlLabel
                    },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:dateFormValidatorErrorSummaryMessage',
                        { controlLabel },
                        undefined,
                        undefined,
                        undefined,
                        FormatMode.Sprintf)
                    : undefined
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.OnGoing
    };
};
