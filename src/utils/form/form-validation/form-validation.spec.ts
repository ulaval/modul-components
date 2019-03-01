import { FormValidation } from './form-validation';

describe(`FormValidation`, () => {
    it(`Default parameters are setup`, () => {
        let formValidation: FormValidation = new FormValidation();
        expect(formValidation.hasError).toBeFalsy();
        expect(formValidation.errorMessage).toBe('');
    });
});
