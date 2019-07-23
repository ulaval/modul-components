import { FormatMode } from '../../../i18n/i18n';
import { ModulVue } from '../../../vue/vue';
import { AbstractControl } from '../../abstract-control';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';
/**
 *
 * @param options options required to personnalise the validator, like the timing of the validation or the error messages to display.
 */
export const RequiredValidator: (options?: ControlValidatorOptions) => ControlValidator = (options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Required,
        validationFunction: (control: AbstractControl): boolean => {
            let isPopulate: boolean = false;

            let assertPopulate: Function = (value: any): boolean => {
                if (!isNaN(value) && value === 0) {
                    return true;
                } else if (Array.isArray(value)) {
                    return value.length > 0;
                }

                return !!value;
            };

            if (control instanceof FormGroup) {
                isPopulate = control.controls
                    .filter(c => c instanceof FormControl)
                    .every((fc: FormControl<any>) => {
                        return assertPopulate(fc.value);
                    });
            } else {
                isPopulate = assertPopulate((control as FormControl<any>).value);
            }

            return isPopulate;
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:requiredValidatorErrorMessage',
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    FormatMode.Sprintf),
                groupMessage: options && options.controlLabel ?
                    (ModulVue.prototype.$i18n).translate(
                        'm-form:requiredValidatorErrorSummaryMessage',
                        { controlLabel: options.controlLabel },
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
