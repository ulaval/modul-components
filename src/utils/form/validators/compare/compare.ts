import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { ControlValidatorValidationType } from "../../control-validator-validation-type";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";
import { ControlValidator, ControlValidatorOptions } from "../control-validator";
import { ValidatorKeys } from "../validator-error-keys";

export const CompareValidator: Function = (controlNames: string[], options?: ControlValidatorOptions): ControlValidator => {
    return {
        key: ValidatorKeys.Compare,
        validationFunction: (control: FormGroup): Promise<boolean> => {
            if (control instanceof FormControl) {
                throw Error('the compare controls validator should not be attached to a form control');
            }

            return Promise.resolve(controlNames
                .map(cn => (control.getControl(cn) as FormControl<any>))
                .every(fc => fc.value === (control.controls[0] as FormControl<any>).value));
        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:compareValidatorErrorMessage',
                    { controlNames: controlNames.join(', ') },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: (ModulVue.prototype.$i18n).translate(
                    'm-form:compareValidatorErrorMessage',
                    { controlNames: controlNames.join(', ') },
                    undefined, undefined, undefined, FormatMode.Sprintf
                )
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Correction
    };
};
