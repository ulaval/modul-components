import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";
import { ControlValidator } from "../control-validator";

export const CompareValidator: Function = (controlNames: string[]): ControlValidator => {
    return {
        validationFunction: (control: FormGroup): boolean => {
            if (control instanceof FormControl) {
                throw Error('the compare controls validator should not be attached to a form control');
            }

            return controlNames
                .map(cn => (control.getControl(cn) as FormControl<any>))
                .every(fc => fc.value === (control.controls[0] as FormControl<any>).value);
        },
        error: {
            key: ValidatorErrorKeys.Compare,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:compareValidatorErrorMessage',
                { controlNames: controlNames.join(', ') },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:compareValidatorErrorMessage',
                { controlNames: controlNames.join(', ') },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
