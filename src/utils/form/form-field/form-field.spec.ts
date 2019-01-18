import { FormFieldState } from '../form-field-state/form-field-state';
import { FormField } from './form-field';

let validationState: FormFieldState;
let formField: FormField<string>;
const NEW_FIELD_VALUE: string = 'NEW VALUE';
const ERROR_MESSAGE: string = 'ERROR';
const ERROR_MESSAGE_SUMMARY: string = 'ERROR SUMMARY';
const FIELD_VALUE: string = 'VALUE';
const FONCTION_VALIDATION: () => FormFieldState = (): FormFieldState => validationState;

describe(`FormField`, () => {
    describe(`When we create a new instance with a value and a validating function`, () => {
        beforeEach(() => {
            formField = new FormField((): string => FIELD_VALUE, FONCTION_VALIDATION);
        });

        it(`Then the value is the field is the one passed`, () => {
            expect(formField.value).toBe(FIELD_VALUE);
        });

        it(`Then the state of the field is initiated`, () => {
            expect(formField.hasError).toBeFalsy();
            expect(formField.errorMessageSummary).toBe('');
            expect(formField.errorMessage).toBe('');
        });

        describe(`When we validate a valid field`, () => {
            beforeEach(() => {
                validationState = new FormFieldState();
                formField.validate();
            });

            it(`Then the value does not change`, () => {
                expect(formField.value).toBe(FIELD_VALUE);
            });

            it(`Then the state of the field contains no errors`, () => {
                expect(formField.hasError).toBeFalsy();
                expect(formField.errorMessageSummary).toBe('');
                expect(formField.errorMessage).toBe('');
            });
        });

        describe(`When we validate an invalid field`, () => {
            beforeEach(() => {
                validationState = new FormFieldState(true, ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE);
                formField.validate();
            });

            it(`Then the value does not change`, () => {
                expect(formField.value).toBe(FIELD_VALUE);
            });

            it(`Then the state of the field contains errors`, () => {
                expect(formField.hasError).toBeTruthy();
                expect(formField.errorMessageSummary).toBe(ERROR_MESSAGE_SUMMARY);
                expect(formField.errorMessage).toBe(ERROR_MESSAGE);
            });
        });

        describe(`When we change the value of the field with a valid value`, () => {
            beforeEach(() => {
                validationState = new FormFieldState();
                formField.value = NEW_FIELD_VALUE;
            });

            it(`Then the value has changed`, () => {
                expect(formField.value).toBe(NEW_FIELD_VALUE);
            });

            it(`Then the state of the field no longer contains errors`, () => {
                expect(formField.hasError).toBeFalsy();
                expect(formField.errorMessageSummary).toBe('');
                expect(formField.errorMessage).toBe('');
            });
        });

        describe(`When we change the value for an invalid value`, () => {
            beforeEach(() => {
                validationState = new FormFieldState(true, ERROR_MESSAGE_SUMMARY, ERROR_MESSAGE);
                formField.value = NEW_FIELD_VALUE;
            });

            it(`Then the value has changed`, () => {
                expect(formField.value).toBe(NEW_FIELD_VALUE);
            });

            it(`Then the state of the field now contains errors`, () => {
                expect(formField.hasError).toBeTruthy();
                expect(formField.errorMessageSummary).toBe(ERROR_MESSAGE_SUMMARY);
                expect(formField.errorMessage).toBe(ERROR_MESSAGE);
            });

            describe(`When we reset the field`, () => {
                beforeEach(() => {
                    formField.reset();
                });

                it(`Then the value is replaced with the original value`, () => {
                    expect(formField.value).toBe(FIELD_VALUE);
                });

                it(`The state of the field no longer contains errors`, () => {
                    expect(formField.hasError).toBeFalsy();
                    expect(formField.errorMessageSummary).toBe('');
                    expect(formField.errorMessage).toBe('');
                });
            });
        });
    });
});
