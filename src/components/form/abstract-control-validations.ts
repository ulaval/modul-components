import { AbstractControl } from "../../utils/form/abstract-control";
import { AbstractControlValidator } from "../../utils/form/abstract-control-validator";
import { FormControl } from "../../utils/form/form-control";
import { FormGroup } from "../../utils/form/form-group";
import { ValidatorErrorKeys } from "./validator-error-keys";

export const RequiredValidator: Function = (controlName: string): AbstractControlValidator => {
    return {
        validationFunction: (control: AbstractControl): boolean => {
            let isPopulate: boolean = false;

            if (control instanceof FormGroup) {
                isPopulate = control.controls
                    .filter(c => c instanceof FormControl)
                    .every((fc: FormControl<any>) => !!fc.value);
            } else {
                isPopulate = !!(control as FormControl<any>).value;
            }

            return isPopulate;
        },
        error: {
            key: ValidatorErrorKeys.Required,
            message: 'this field is required',
            summaryMessage: `the field ${controlName} is required`
        }
    };
};

export const MinLengthValidator: Function = (controlName: string, minLength: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min length validator should not be attached to a form group');
            }

            return control.value.length >= minLength;
        },
        error: {
            key: ValidatorErrorKeys.MaxLength,
            message: `the min length for this field is ${minLength}`,
            summaryMessage: `The min length for ${controlName} is ${minLength}`
        }
    };
};

export const MaxLengthValidator: Function = (controlName: string, maxLength: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max length validator should not be attached to a form group');
            }

            return control.value.length <= maxLength;
        },
        error: {
            key: ValidatorErrorKeys.MaxLength,
            message: `the max length for this field is ${maxLength}`,
            summaryMessage: `The max length for ${controlName} is ${maxLength}`
        }
    };
};

export const MinValidator: Function = (controlName: string, min: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the min validator should not be attached to a form group');
            }

            let value: number | Date = control.value;

            if (min instanceof Date) {
                value = new Date(control.value);
            }

            return value >= min;
        },
        error: {
            key: ValidatorErrorKeys.Min,
            message: `the min for this field is ${min instanceof Date ? min.toLocaleDateString() : min}`,
            summaryMessage: `The min for ${controlName} is ${min instanceof Date ? min.toLocaleDateString() : min}`
        }
    };
};

export const MaxValidator: Function = (controlName: string, max: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            }

            let value: number | Date = control.value;

            if (max instanceof Date) {
                value = new Date(control.value);
            }

            return value <= max;
        },
        error: {
            key: ValidatorErrorKeys.Max,
            message: `the max for this field is ${max instanceof Date ? max.toLocaleDateString() : max}`,
            summaryMessage: `The min for ${controlName} is ${max instanceof Date ? max.toLocaleDateString() : max}`
        }
    };
};

export const BetweenValidator: Function = (controlName: string, lowerBound: number | Date, upperBound: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            }

            let value: number | Date = control.value;

            if (lowerBound instanceof Date) {
                value = new Date(control.value);
            }

            return value >= lowerBound && value <= upperBound;
        },
        error: {
            key: ValidatorErrorKeys.Between,
            message: `the value have to be between ${lowerBound instanceof Date ? new Date(lowerBound).toLocaleDateString() : lowerBound} and ${upperBound instanceof Date ? new Date(upperBound).toLocaleDateString() : upperBound}`,
            summaryMessage: `The value for ${controlName} have to be between ${lowerBound instanceof Date ? new Date(lowerBound).toLocaleDateString() : lowerBound} and ${upperBound instanceof Date ? new Date(upperBound).toLocaleDateString() : upperBound}`
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
            message: `the email format is not valid`,
            summaryMessage: `The email format for ${controlName} is not valid`
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
            message: `the value of ${controlNames.join(', ')} must be the same`,
            summaryMessage: `the value of ${controlNames.join(', ')} must be the same`
        }
    };
};
