import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";

/**
 * Bound included
 */
export const MaxLengthValidator: Function = (controlName: string, maxLength: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max length validator should not be attached to a form group');
            }

            if (!control.value) {
                return true;
            }

            if (!isNaN(control.value)) {
                return control.value.toString().length <= maxLength;
            }

            return control.value.length <= maxLength;
        },
        error: {
            key: ValidatorErrorKeys.MaxLength,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:maxLengthValidatorErrorMessage',
                { maxLength },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:maxLengthValidatorErrorSummaryMessage',
                { controlName, maxLength },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
