import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

/**
 *
 * @param options options required to personnalise the validator, like the timing of the validation or the error messages to display.
 */
export const EmailValidator: (options?: ControlValidatorOptions) => ControlValidator = (options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Email,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the email validator should not be attached to a form group');
            }

            let re: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return control.value ? re.test(String(control.value).toLowerCase()) : true;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:emailValidatorErrorMessage'
                ),
                groupMessage: options && options.controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:emailValidatorErrorSummaryMessage',
                        { controlLabel: options.controlLabel },
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
