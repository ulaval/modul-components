// tslint:disable:no-identical-functions no-big-function

import { Form } from './form';
import { FormFieldState } from './form-field-state/form-field-state';
import { FormField } from './form-field/form-field';

let validationState: FormFieldState;
let formField: FormField<string>;
let form: Form;

const ERROR_MESSAGE: string = 'ERROR';
const ERROR_MESSAGE_SUMMARY: string = 'ERROR SUMMARY';
const FIELD_VALUE: string = 'VALUE';
const VALIDATING_FUNCTION: () => FormFieldState = (): FormFieldState => validationState;

describe(`Form`, () => {
    describe(`When the form contains no fields with errors`, () => {
        beforeEach(() => {
            validationState = new FormFieldState();
            formField = new FormField((): string => FIELD_VALUE, VALIDATING_FUNCTION);
            form = new Form([formField]);
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

    describe(`When at least one field has errors`, () => {
        beforeEach(() => {
            validationState = new FormFieldState(true, ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE);
            formField = new FormField((): string => FIELD_VALUE, VALIDATING_FUNCTION);
            form = new Form([formField]);
        });

        it(`Then the form is valid at first`, () => {
            expect(form.isValid).toBeTruthy();
        });

        it(`nbFieldsThatHasError returns 0`, () => {
            expect(form.nbFieldsThatHasError).toBe(0);
        });

        describe(`When we validate all fields`, () => {
            beforeEach(() => {
                form.validateAll();
            });

            it(`Then the form is invalid`, () => {
                expect(form.isValid).toBeFalsy();
            });

            it(`nbFieldsThatHasError returns 1`, () => {
                expect(form.nbFieldsThatHasError).toBe(1);
            });

            it(`getErrorsForSummary returns 1 error message`, () => {
                expect(form.getErrorsForSummary()).toEqual([ERROR_MESSAGE_SUMMARY]);
            });
        });
    });

    describe(`When we reset the form`, () => {
        it(`Then each fields are reset`, () => {
            formField = new FormField((): string => FIELD_VALUE, VALIDATING_FUNCTION);
            form = new Form([formField, formField]);
            FormField.prototype.reset = jest.fn();

            form.reset();

            expect(FormField.prototype.reset).toHaveBeenCalledTimes(form.fields.length);
        });
    });
});
