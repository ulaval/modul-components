import { FormFieldValidation } from './form-field-validation';

describe(`FormFieldValidation`, () => {
    it(`Default parameters are setup`, () => {
        let formFieldValidation: FormFieldValidation = new FormFieldValidation();
        expect(formFieldValidation.isError).toBeFalsy();
        expect(formFieldValidation.errorMessagesSummary).toEqual([]);
        expect(formFieldValidation.errorMessages).toEqual([]);
    });
});
