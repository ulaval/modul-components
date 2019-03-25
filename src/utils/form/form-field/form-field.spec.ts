import { InputManagement } from '../../../mixins/input-management/input-management';
import { FormFieldState } from '../form-field-state/form-field-state';
import { FormFieldValidation } from '../form-field-validation/form-field-validation';
import { FieldValidationCallback, FormField, FormFieldEditionContext, FormFieldValidationType } from './form-field';

let formFieldValidation: FormFieldValidation;
let formField: FormField<string>;
let HTML_ELEMENT: HTMLElement = new InputManagement() as any as HTMLElement;
const NEW_FIELD_VALUE: string = 'NEW VALUE';
const ERROR_MESSAGE: string = 'ERROR';
const ERROR_MESSAGE_SUMMARY: string = 'ERROR SUMMARY';
const FIELD_VALUE: string = 'VALUE';
const VALIDATION_FUNCTIONS: FieldValidationCallback<string>[] = [(): FormFieldValidation => formFieldValidation];

describe(`FormField`, () => {
    describe(`When we create a new instance with a value and a validating function`, () => {
        beforeEach(() => {
            formField = new FormField((): string => FIELD_VALUE, VALIDATION_FUNCTIONS);
            formField.endEdition();
        });

        it(`Then the value is the field is the one passed`, () => {
            expect(formField.value).toBe(FIELD_VALUE);
        });

        it(`Then the state of the field is initiated`, () => {
            expect(formField.hasError).toBeFalsy();
            expect(formField.errorMessageSummary).toEqual([]);
            expect(formField.errorMessage).toBe('');
        });

        describe(`When we validate a valid field`, () => {
            beforeEach(() => {
                formFieldValidation = new FormFieldValidation();
                formField.validate();
            });

            it(`Then the value does not change`, () => {
                expect(formField.value).toBe(FIELD_VALUE);
            });

            it(`Then the state of the field contains no errors`, () => {
                expect(formField.hasError).toBeFalsy();
                expect(formField.errorMessageSummary).toEqual([]);
                expect(formField.errorMessage).toBe('');
            });
        });

        describe(`When we validate an invalid field`, () => {
            beforeEach(() => {
                formFieldValidation = new FormFieldValidation(true, [ERROR_MESSAGE_SUMMARY], [ERROR_MESSAGE]);
                formField.validate(true);
            });

            it(`Then the value does not change`, () => {
                expect(formField.value).toBe(FIELD_VALUE);
            });

            it(`Then the state of the field contains errors`, () => {
                expect(formField.hasError).toBeTruthy();
                expect(formField.errorMessageSummary).toEqual([ERROR_MESSAGE_SUMMARY]);
                expect(formField.errorMessage).toBe(ERROR_MESSAGE);
            });
        });

        describe(`When we change the value of the field with a valid value`, () => {
            beforeEach(() => {
                formFieldValidation = new FormFieldValidation();
                formField.value = NEW_FIELD_VALUE;
            });

            it(`Then the value has changed`, () => {
                expect(formField.value).toBe(NEW_FIELD_VALUE);
            });

            it(`Then the state of the field no longer contains errors`, () => {
                expect(formField.hasError).toBeFalsy();
                expect(formField.errorMessageSummary).toEqual([]);
                expect(formField.errorMessage).toBe('');
            });
        });

        describe(`When we change the value for an invalid value`, () => {
            beforeEach(() => {
                formFieldValidation = new FormFieldValidation(true, [ERROR_MESSAGE_SUMMARY], [ERROR_MESSAGE]);
                formField.initEdition();
                formField.value = NEW_FIELD_VALUE;
            });

            it(`Then the value has changed`, () => {
                expect(formField.value).toBe(NEW_FIELD_VALUE);
            });

            it(`Then the state of the field now contains errors`, () => {
                expect(formField.hasError).toBeTruthy();
                expect(formField.errorMessageSummary).toEqual([ERROR_MESSAGE_SUMMARY]);
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
                    expect(formField.errorMessageSummary).toEqual([]);
                    expect(formField.errorMessage).toBe('');
                });
            });
        });

        /**
         * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
         */
        describe(`When we update form field with different type of validations`, () => {
            formFieldValidation = new FormFieldValidation();
            let formFieldForValidationTypeTest: FormField<string> = new FormField((): string => '');
            const spy: jest.SpyInstance = jest.spyOn(formFieldForValidationTypeTest as any, 'changeState');

            describe(`When we update value of a form field with optimisitc validation type`, () => {
                beforeAll(() => {
                    formFieldForValidationTypeTest['validationType'] = FormFieldValidationType.Optimistic;
                });

                beforeEach(() => {
                    formFieldForValidationTypeTest.reset();
                });

                describe(`When the field value is empty and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        spy.mockReset();
                    });

                    it(`Then the field should is empty and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeFalsy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will not trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.EmptyAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(0);
                    });
                });

                describe(`When the field value is populate and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest.value = 'test value';
                        jest.resetAllMocks();
                    });

                    it(`Then the field should be populate and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeTruthy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.PopulateAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(1);
                    });
                });

                describe(`When the field is not valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest['internalState'] = new FormFieldState(true, [''], ['']);
                        jest.resetAllMocks();
                    });

                    it(`Then the field is not valid`, () => {
                        expect(formFieldForValidationTypeTest.isValid).toBeFalsy();
                    });

                    it(`Then the validation will trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.NotValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe(`When we update value of a form field with on-going validation type`, () => {
                beforeAll(() => {
                    formFieldForValidationTypeTest['validationType'] = FormFieldValidationType.OnGoing;
                });

                beforeEach(() => {
                    formFieldForValidationTypeTest.reset();
                });

                describe(`When the field value is empty and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        spy.mockReset();
                    });

                    it(`Then the field should is empty and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeFalsy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.EmptyAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(1);
                    });
                });

                describe(`When the field value is populate and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest.value = 'test value';
                        jest.resetAllMocks();
                    });

                    it(`Then the field should be populate and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeTruthy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.PopulateAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(1);
                    });
                });

                describe(`When the field is not valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest['internalState'] = new FormFieldState(true, [''], ['']);
                        jest.resetAllMocks();
                    });

                    it(`Then the field is not valid`, () => {
                        expect(formFieldForValidationTypeTest.isValid).toBeFalsy();
                    });

                    it(`Then the validation will trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.NotValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe(`When we update value of a form field with correctable validation type`, () => {
                beforeAll(() => {
                    formFieldForValidationTypeTest['validationType'] = FormFieldValidationType.Correctable;
                });

                beforeEach(() => {
                    formFieldForValidationTypeTest.reset();
                });

                describe(`When the field value is empty and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        spy.mockReset();
                    });

                    it(`Then the field should is empty and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeFalsy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will not trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.EmptyAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(0);
                    });
                });

                describe(`When the field value is populate and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest.value = 'test value';
                        jest.resetAllMocks();
                    });

                    it(`Then the field should be populate and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeTruthy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will not trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.PopulateAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(0);
                    });
                });

                describe(`When the field is not valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest['internalState'] = new FormFieldState(true, [''], ['']);
                        jest.resetAllMocks();
                    });

                    it(`Then the field is not valid`, () => {
                        expect(formFieldForValidationTypeTest.isValid).toBeFalsy();
                    });

                    it(`Then the validation will trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.NotValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe(`When we update value of a form field with at-exit validation type`, () => {
                beforeAll(() => {
                    formFieldForValidationTypeTest['validationType'] = FormFieldValidationType.AtExit;
                });

                beforeEach(() => {
                    formFieldForValidationTypeTest.reset();
                });

                describe(`When the field value is empty and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        spy.mockReset();
                    });

                    it(`Then the field should is empty and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeFalsy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will not trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.EmptyAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(0);
                    });
                });

                describe(`When the field value is populate and valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest.value = 'test value';
                        jest.resetAllMocks();
                    });

                    it(`Then the field should be populate and valid`, () => {
                        expect(formFieldForValidationTypeTest.value).toBeTruthy();
                        expect(formFieldForValidationTypeTest.isValid).toBeTruthy();
                    });

                    it(`Then the validation will not trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.PopulateAndValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(0);
                    });
                });

                describe(`When the field is not valid`, () => {
                    beforeEach(() => {
                        formFieldForValidationTypeTest.reset();
                        formFieldForValidationTypeTest['internalState'] = new FormFieldState(true, [''], ['']);
                        jest.resetAllMocks();
                    });

                    it(`Then the field is not valid`, () => {
                        expect(formFieldForValidationTypeTest.isValid).toBeFalsy();
                    });

                    it(`Then the validation will not trigger while editing`, () => {
                        formFieldForValidationTypeTest.initEdition();
                        expect(formFieldForValidationTypeTest['editionContext']).toBe(FormFieldEditionContext.NotValid);
                        formFieldForValidationTypeTest.value = NEW_FIELD_VALUE;
                        expect(spy).toHaveBeenCalledTimes(0);
                    });
                });
            });
        });
    });
});
