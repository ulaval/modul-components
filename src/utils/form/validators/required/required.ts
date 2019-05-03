import { ValidatorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { AbstractControl } from "../../abstract-control";
import { ControlValidatorValidationType } from "../../control-validator-validation-type";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";
import { ControlValidator, ControlValidatorOptions } from "../control-validator";

export const RequiredValidator: Function = (controlName: string, options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Required,
        validationFunction: (control: AbstractControl): Promise<boolean> => {
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

            return Promise.resolve(isPopulate);
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:requiredValidatorErrorMessage',
                    { controlName },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: (ModulVue.prototype.$i18n).translate(
                    'm-form:requiredValidatorErrorSummaryMessage',
                    { controlName },
                    undefined, undefined, undefined, FormatMode.Sprintf
                )
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.OnGoing
    };
};
