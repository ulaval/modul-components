import { AbstractControl } from "../../utils/form/abstract-control";
import { AbstractControlValidator } from "../../utils/form/abstract-control-validator";
import { FormControl } from "../../utils/form/form-control";
import { FormGroup } from "../../utils/form/form-group";

export enum ValidatorErrorKeys {
    Required = 'required',
    MinLength = 'min-length',
    MaxLength = 'max-length',
    Min = 'min',
    Max = 'max',
    Between = 'between',
    Email = 'email',
    CompareControls = 'compare-controls'
}

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
            key: 'required',
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
            key: 'min-length',
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
            key: 'max-length',
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

            return control.value >= min;
        },
        error: {
            key: 'min',
            message: `the min for this field is ${min}`,
            summaryMessage: `The min for ${controlName} is ${min}`
        }
    };
};

export const MaxValidator: Function = (controlName: string, max: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            }

            return control.value <= max;
        },
        error: {
            key: 'max',
            message: `the max for this field is ${max}`,
            summaryMessage: `The min for ${controlName} is ${max}`
        }
    };
};

export const BetweenValidator: Function = (controlName: string, lowerBound: number | Date, upperBound: number | Date): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            }

            return control.value >= lowerBound && control.value <= upperBound;
        },
        error: {
            key: 'max',
            message: `the value have to be between ${lowerBound} and ${upperBound}`,
            summaryMessage: `The value for ${controlName} have to be between ${lowerBound} and ${upperBound}`
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
            key: 'email',
            message: `the email format is not valid`,
            summaryMessage: `The email format for ${controlName} is not valid`
        }
    };
};

export const CompareControlsValidator: Function = (controlNames: string[]): AbstractControlValidator => {
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
            key: 'compare-controls',
            message: `the value of ${controlNames.join(', ')} must be the same`,
            summaryMessage: `the value of ${controlNames.join(', ')} must be the same`
        }
    };
};
