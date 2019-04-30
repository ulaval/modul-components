import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";

/**
 * Bound included
 */
export const MinLengthValidator: Function = (controlName: string, minLength: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min length validator should not be attached to a form group');
            }

            if (!control.value) {
                return false;
            }

            if (!isNaN(control.value)) {
                return control.value.toString().length >= minLength;
            }

            return control.value.length >= minLength;
        },
        error: {
            key: ValidatorErrorKeys.MaxLength,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:minLengthValidatorErrorMessage',
                { minLength },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:minLengthValidatorErrorSummaryMessage',
                { controlName, minLength },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
