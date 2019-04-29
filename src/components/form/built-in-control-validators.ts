import { min } from "moment";
import { AbstractControl } from "../../utils/form/abstract-control";
import { AbstractControlValidator } from "../../utils/form/abstract-control-validator";
import { FormControl } from "../../utils/form/form-control";
import { FormGroup } from "../../utils/form/form-group";
import { FormatMode } from "../../utils/i18n/i18n";
import { ModulVue } from "../../utils/vue/vue";
import { ValidatorErrorKeys } from "./validator-error-keys";

export const RequiredValidator: Function = (controlName: string): AbstractControlValidator => {
    return {
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
        error: {
            key: ValidatorErrorKeys.Required,
            message: (ModulVue.prototype.$i18n).translate(
                'm-form:requiredValidatorErrorMessage',
                { controlName },
                undefined, undefined, undefined, FormatMode.Sprintf
            ),
            summaryMessage: (ModulVue.prototype.$i18n).translate(
                'm-form:requiredValidatorErrorSummaryMessage',
                { controlName },
                undefined, undefined, undefined, FormatMode.Sprintf
            )
        }
    };
};

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
                { max: min instanceof Date ? min.toLocaleDateString() : max },
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

export const CompareValidator: Function = (controlNames: string[]): AbstractControlValidator => {
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
