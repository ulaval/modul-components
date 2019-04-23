import { AbstractControl } from "../../utils/form/abstract-control";
import { AbstractControlValidator } from "../../utils/form/abstract-control-validator";
import { FormControl } from "../../utils/form/form-control";
import { FormGroup } from "../../utils/form/form-group";

export const AbstractControlRequiredValidator: (name: string) => AbstractControlValidator = (name: string): AbstractControlValidator => {
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
            summaryMessage: `the field ${name} is required`
        }
    };
};

export const AbstractControlMinLengthValidator: (name: string, minLength: number) => AbstractControlValidator = (name: string, minLength: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            let isMinLength: boolean = false;

            if (control instanceof FormGroup) {
                throw Error('the min length validator should not be attached to a form group');
            } else {
                isMinLength = control.value.length >= minLength;
            }

            return isMinLength;
        },
        error: {
            key: 'min-length',
            message: `the min length for this field is ${minLength}`,
            summaryMessage: `The min length for ${name} is ${minLength}`
        }
    };
};

export const AbstractControlMaxLengthValidator: (name: string, maxLength: number) => AbstractControlValidator = (name: string, maxLength: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            let isMaxLength: boolean = false;

            if (control instanceof FormGroup) {
                throw Error('the max length validator should not be attached to a form group');
            } else {
                isMaxLength = control.value.length >= maxLength;
            }

            return isMaxLength;
        },
        error: {
            key: 'max-length',
            message: `the max length for this field is ${maxLength}`,
            summaryMessage: `The max length for ${name} is ${maxLength}`
        }
    };
};

export const AbstractControlMinValidator: (name: string, min: number) => AbstractControlValidator = (name: string, min: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            let isMin: boolean = false;

            if (control instanceof FormGroup) {
                throw Error('the min validator should not be attached to a form group');
            } else {
                isMin = Number(control.value) >= min;
            }

            return isMin;
        },
        error: {
            key: 'min',
            message: `the min for this field is ${min}`,
            summaryMessage: `The min for ${name} is ${min}`
        }
    };
};

export const AbstractControlMaxValidator: (name: string, max: number) => AbstractControlValidator = (name: string, max: number): AbstractControlValidator => {
    return {
        validationFunction: (control: FormControl<any>): boolean => {
            let isMax: boolean = false;

            if (control instanceof FormGroup) {
                throw Error('the max validator should not be attached to a form group');
            } else {
                isMax = Number(control.value) <= max;
            }

            return isMax;
        },
        error: {
            key: 'max',
            message: `the max for this field is ${max}`,
            summaryMessage: `The min for ${name} is ${max}`
        }
    };
};



