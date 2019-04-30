import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";

/**
 * Bound included
 */
export const MinValidator: Function = (controlName: string, min: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min validator should not be attached to a form group');
            }

            if (!control.value && control.value !== 0) {
                return false;
            }

            let value: number | Date = control.value;

            if (min instanceof Date) {
                value = new Date(control.value);
            }

            return value >= min;
        },
        error: {
            key: ValidatorErrorKeys.Min,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:minValidatorErrorMessage',
                { min: min instanceof Date ? min.toLocaleDateString() : min },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:minValidatorErrorSummaryMessage',
                {
                    controlName,
                    min: min instanceof Date ? min.toLocaleDateString() : min
                },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
