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
            let isMinLenght: boolean = false;

            if (control instanceof FormGroup) {
                throw Error('the min length validator should not be attached to a form group');
            } else {
                isMinLenght = control.value.length >= minLength;
            }

            return isMinLenght;
        },
        error: {
            key: 'min-length',
            message: `the min length for this field is ${minLength}`,
            summaryMessage: `The min length for ${name} is ${minLength}`
        }
    };
};



