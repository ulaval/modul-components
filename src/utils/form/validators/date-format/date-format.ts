import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';

export const DateFormatValidator: Function = (controlLabel: string, options: ControlValidatorOptions): ControlValidator => {
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
                    return false;
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
                groupMessage: (ModulVue.prototype.$i18n).translate(
                    'm-form:dateFormValidatorErrorSummaryMessage',
                    { controlLabel },
                    undefined, undefined, undefined, FormatMode.Sprintf
                )
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Correction
    };
};
