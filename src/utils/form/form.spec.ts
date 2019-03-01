// tslint:disable:no-identical-functions no-big-function

import { Form } from './form';
import { FormFieldValidation } from './form-field-validation/form-field-validation';
import { FieldValidationCallback, FormField } from './form-field/form-field';
import { FormValidation } from './form-validation/form-validation';

let mockFormField: any = {};
jest.mock('./form-field/form-field', () => {
    return {
        FormField: jest.fn().mockImplementation(() => {
            return mockFormField;
        })
    };
});

let fieldValidation: FormFieldValidation;
let form: Form;
let formFieldHasError: boolean = false;

const ERROR_MESSAGE_SUMMARY: string = 'ERROR SUMMARY';
const FIELD_VALUE: string = 'VALUE';
const VALIDATING_FUNCTION: FieldValidationCallback<string> = (): FormFieldValidation => fieldValidation;

const mockFieldValidationWithError: FormFieldValidation = {
    isError: true,
    errorMessages: ['errorMessage'],
    errorMessagesSummary: ['errorMessageSummary']
};
let errorFormField: FormField<string>;
let formFieldSummaryErrors: string[];

describe(`Form`, () => {
    beforeEach(() => {
        mockFormField = {
            hasError: formFieldHasError,
            reset: jest.fn(),
            errorMessageSummary: formFieldSummaryErrors,
            validate: jest.fn(),
            focusThisField: jest.fn(),
            touch: jest.fn(),
            shouldFocus: false
        };
        ((FormField as unknown) as jest.Mock).mockClear();
    });

    describe(`When the form contains no fields with errors`, () => {
        beforeEach(() => {
            form = new Form({
                'a-field': new FormField((): string => FIELD_VALUE, [VALIDATING_FUNCTION])
            });
        });

        it(`Then the form is valid`, () => {
            expect(form.isValid).toBeTruthy();
        });

        it(`nbFieldsThatHasError returns 0`, () => {
            expect(form.nbFieldsThatHasError).toBe(0);
        });

        describe(`When we validate all fields`, () => {
            beforeEach(() => {
                form.validateAll();
            });

            it(`Then the form is valid`, () => {
                expect(form.isValid).toBeTruthy();
            });

            it(`nbFieldsThatHasError returns 0`, () => {
                expect(form.nbFieldsThatHasError).toBe(0);
            });

        });
    });

    describe(`When the form contains no error`, () => {
        beforeEach(() => {
            form = new Form({}, [() => new FormValidation()]);
        });

        it(`Then the form is valid`, () => {
            expect(form.isValid).toBeTruthy();
        });
    });

    describe(`When the form has error`, () => {
        beforeEach(() => {
            form = new Form({}, [() => new FormValidation(true, ERROR_MESSAGE_SUMMARY)]);
            form.validateAll();
        });

        it(`Then the form is invalid`, () => {
            expect(form.isValid).toBeFalsy();
        });

        it(`getErrors returns 1 error message`, () => {
            expect(form.getErrorsForSummary()).toEqual([ERROR_MESSAGE_SUMMARY]);
        });
    });
    describe(`When at least one field has errors`, () => {
        beforeEach(() => {
            form = new Form({
                'a-field': new FormField((): string => FIELD_VALUE, [() => mockFieldValidationWithError])
            });
        });

        it(`Then the form is valid at first`, () => {
            expect(form.isValid).toBeTruthy();
        });

        it(`nbFieldsThatHasError returns 0`, () => {
            expect(form.nbFieldsThatHasError).toBe(0);
        });

        describe(`When we validate all fields`, () => {
            beforeEach(() => {
                formFieldHasError = true;
                formFieldSummaryErrors = [ERROR_MESSAGE_SUMMARY];
                form.validateAll();
            });

            it(`validates each fields`, () => {
                expect(mockFormField.touch).toHaveBeenCalledTimes(1);
            });

            it(`getErrorsForSummary returns 1 error message`, () => {
                expect(form.getErrorsForSummary()).toEqual([ERROR_MESSAGE_SUMMARY]);
            });

            it(`nbFieldsThatHasError returns 1`, () => {
                expect(form.nbFieldsThatHasError).toBe(1);
            });

            it(`Then the form is invalid`, () => {
                expect(form.isValid).toBeFalsy();
            });

            it(`Then the form can focus the first field in error`, () => {
                form.focusFirstFieldWithError();

                expect(mockFormField.shouldFocus).toBe(true);
            });
        });
    });

    describe(`When we reset the form`, () => {
        it(`Then each fields are reset`, () => {
            form = new Form({
                'a-field': new FormField((): string => FIELD_VALUE, [VALIDATING_FUNCTION]),
                'another-field': new FormField((): string => FIELD_VALUE, [VALIDATING_FUNCTION])
            });
            const spy: jest.SpyInstance = jest.spyOn(mockFormField, 'reset');

            form.reset();

            expect(spy).toHaveBeenCalledTimes(form.fields.length);
        });
    });
});
