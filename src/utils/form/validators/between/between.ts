import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";

/**
 *  bounds included
 */
export const BetweenValidator: Function = (controlName: string, lowerBound: number | Date, upperBound: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the between validator should not be attached to a form group');
            }

            if (!control.value && control.value !== 0) {
                return false;
            }

            let value: number | Date = control.value;

            if (lowerBound instanceof Date) {
                value = new Date(control.value);
            }

            return value >= lowerBound && value <= upperBound;
        },
        error: {
            key: ValidatorErrorKeys.Between,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:betweenValidatorErrorMessage',
                {
                    lowerBound: lowerBound instanceof Date ? lowerBound.toLocaleDateString() : lowerBound,
                    upperBound: upperBound instanceof Date ? upperBound.toLocaleDateString() : upperBound
                },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:betweenValidatorErrorSummaryMessage',
                { controlName, lowerBound, upperBound },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
