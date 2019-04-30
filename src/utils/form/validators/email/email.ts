import { ValidatorErrorKeys } from "../../../../components/form/validator-error-keys";
import { FormatMode } from "../../../i18n/i18n";
import { ModulVue } from "../../../vue/vue";
import { FormControl } from "../../form-control";
import { FormGroup } from "../../form-group";

export const EmailValidator: Function = (controlName: string): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the email validator should not be attached to a form group');
            }

            let re: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return re.test(String(control.value).toLowerCase());
        },
        error: {
            key: ValidatorErrorKeys.Email,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:emailValidatorErrorMessage'
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:emailValidatorErrorSummaryMessage',
                { controlName },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};
