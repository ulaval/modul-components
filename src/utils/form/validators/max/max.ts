import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";

/**
 * Bound included
 */
export const MaxValidator: Function = (controlName: string, max: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            }

            if (!control.value && control.value !== 0) {
                return true;
            }

            let value: number | Date = control.value;

            if (max instanceof Date) {
                value = new Date(control.value);
            }

            return value <= max;
        },
        error: {
            key: ValidatorErrorKeys.Max,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:maxValidatorErrorMessage',
                { max: max instanceof Date ? max.toLocaleDateString() : max },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:maxValidatorErrorSummaryMessage',
                {
                    controlName,
                    max: max instanceof Date ? max.toLocaleDateString() : max
                },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
