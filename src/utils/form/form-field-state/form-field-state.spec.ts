import { FormFieldState } from './form-field-state';

describe(`FormFieldState`, () => {
    it(`Default parameters are setup`, () => {
        let formFieldState: FormFieldState = new FormFieldState();
        expect(formFieldState.hasError).toBeFalsy();
        expect(formFieldState.errorMessagesSummary).toEqual([]);
        expect(formFieldState.errorMessages).toEqual([]);
    });
});
