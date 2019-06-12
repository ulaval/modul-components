import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param controlLabel Id by which the validator can be accesses, must be unique within the same AbstractControl validators.
 * @param maxLength Max length (inclusive)
 * @param options Options to configure the validator
 */
export const MaxLengthValidator: (maxLength: number, controlLabel?: string, options?: ControlValidatorOptions) => ControlValidator = (maxLength: number, controlLabel?: string, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.MaxLength,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max length validator should not be attached to a form group');
            }

            let isMaxLength: boolean;

            if (!control.value) {
                isMaxLength = true;
            } else if (!isNaN(control.value)) {
                isMaxLength = control.value.toString().length <= maxLength;
            } else {
                isMaxLength = control.value.length <= maxLength;
            }

            return isMaxLength;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:maxLengthValidatorErrorMessage',
                    { maxLength },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:maxLengthValidatorErrorSummaryMessage',
                        {
                            controlLabel,
                            maxLength
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
